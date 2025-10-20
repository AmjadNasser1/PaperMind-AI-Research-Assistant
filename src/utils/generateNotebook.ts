export const generateNotebook = () => {
  const notebookContent = {
    cells: [
      {
        cell_type: "markdown",
        metadata: {},
        source: [
          "# 🧠 AI Research Assistant\n",
          "\n",
          "## OBJECTIVES:\n",
          "1. Read Research Papers\n",
          "2. Summarize Findings\n",
          "3. Identify Gaps in Literature\n",
          "4. Suggest Future Research Directions\n",
          "5. Chatbot for Questions\n",
          "6. Analyze Uploaded PDF Papers\n",
          "\n",
          "---\n",
          "\n",
          "**Run all cells in order. The final cell launches an interactive Gradio interface.**"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# Install required packages\n",
          "!pip install -q -U bitsandbytes accelerate transformers sentence-transformers faiss-cpu arxiv gradio yake pypdf2 nltk"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# IMPORTS & SETUP\n",
          "import os, re, faiss, torch, arxiv, datetime, yake\n",
          "import gradio as gr\n",
          "from PyPDF2 import PdfReader\n",
          "from sentence_transformers import SentenceTransformer\n",
          "from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig\n",
          "from nltk.tokenize import sent_tokenize\n",
          "import nltk\n",
          "nltk.download(\"punkt\")\n",
          "nltk.download(\"punkt_tab\", quiet=True)\n",
          "\n",
          "device = \"cuda\" if torch.cuda.is_available() else \"cpu\"\n",
          "print(f\"✅ Running on device: {device.upper()}\")"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# READ RESEARCH PAPERS\n",
          "def fetch_arxiv(query, max_results=20):\n",
          "    \"\"\"Fetches research papers from ArXiv by topic.\"\"\"\n",
          "    search = arxiv.Search(query=query, max_results=max_results)\n",
          "    results = []\n",
          "    for r in search.results():\n",
          "        results.append({\n",
          "            \"title\": r.title.strip(),\n",
          "            \"abstract\": r.summary.strip(),\n",
          "            \"domain\": query\n",
          "        })\n",
          "    return results\n",
          "\n",
          "# Define main domains of interest\n",
          "DOMAINS = [\n",
          "    \"computer vision\", \"natural language processing\", \"bioinformatics\",\n",
          "    \"robotics\", \"cybersecurity\", \"climate modeling\"\n",
          "]\n",
          "\n",
          "# Fetch research papers from each domain\n",
          "corpus = []\n",
          "for d in DOMAINS:\n",
          "    corpus += fetch_arxiv(f\"{d} machine learning\", max_results=20)\n",
          "\n",
          "print(f\"📚 Loaded {len(corpus)} total papers from ArXiv.\")"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# DATA PREPARATION & EMBEDDINGS\n",
          "embedder = SentenceTransformer(\"all-MiniLM-L6-v2\")\n",
          "texts = [f\"{p['title']}. {p['abstract']}\" for p in corpus]\n",
          "embeddings = embedder.encode(texts, convert_to_numpy=True, show_progress_bar=True)\n",
          "faiss.normalize_L2(embeddings)\n",
          "index = faiss.IndexFlatIP(embeddings.shape[1])\n",
          "index.add(embeddings)\n",
          "\n",
          "def retrieve(query, k=5):\n",
          "    \"\"\"Retrieves the most relevant research papers.\"\"\"\n",
          "    q_emb = embedder.encode([query], convert_to_numpy=True)\n",
          "    faiss.normalize_L2(q_emb)\n",
          "    D, I = index.search(q_emb, k)\n",
          "    results = []\n",
          "    for idx, score in zip(I[0], D[0]):\n",
          "        paper = corpus[idx].copy()\n",
          "        paper[\"score\"] = round(float(score), 3)\n",
          "        results.append(paper)\n",
          "    return results"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# LOAD AI MODEL (Qwen2.5-7B-Instruct with 4-bit quantization)\n",
          "print(\"🧠 Loading model...\")\n",
          "\n",
          "use_qwen = False\n",
          "try:\n",
          "    MODEL_NAME = \"Qwen/Qwen2.5-7B-Instruct\"\n",
          "    bnb_cfg = BitsAndBytesConfig(\n",
          "        load_in_4bit=True,\n",
          "        bnb_4bit_use_double_quant=True,\n",
          "        bnb_4bit_quant_type=\"nf4\",\n",
          "        bnb_4bit_compute_dtype=torch.bfloat16\n",
          "    )\n",
          "    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, trust_remote_code=True)\n",
          "    model = AutoModelForCausalLM.from_pretrained(\n",
          "        MODEL_NAME,\n",
          "        quantization_config=bnb_cfg,\n",
          "        device_map=\"auto\",\n",
          "        trust_remote_code=True\n",
          "    )\n",
          "    use_qwen = True\n",
          "    print(\"✅ Loaded Qwen2.5-7B-Instruct successfully.\")\n",
          "except Exception as e:\n",
          "    print(\"⚠️ Qwen too large, using fallback model:\", e)\n",
          "    MODEL_NAME = \"distilgpt2\"\n",
          "    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)\n",
          "    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to(device)"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# SUMMARIZATION & GAP DETECTION PIPELINE\n",
          "SYSTEM_PROMPT = (\n",
          "    \"You are an AI Research Assistant. \"\n",
          "    \"Summarize research findings clearly, identify knowledge gaps, \"\n",
          "    \"and propose future research directions based ONLY on the given context.\"\n",
          ")\n",
          "\n",
          "def build_context(retrieved, max_chars=3000):\n",
          "    \"\"\"Constructs readable context for the model.\"\"\"\n",
          "    parts = []\n",
          "    for r in retrieved:\n",
          "        snippet = \" \".join(sent_tokenize(r['abstract'])[:3])\n",
          "        parts.append(f\"[{r['domain'].upper()}] {r['title']}: {snippet}\")\n",
          "    return \"\\n\\n\".join(parts)[:max_chars]\n",
          "\n",
          "def rag_generate(query, top_k=5, max_new_tokens=350):\n",
          "    \"\"\"Runs full RAG process: retrieve → summarize → output.\"\"\"\n",
          "    retrieved = retrieve(query, k=top_k)\n",
          "    context = build_context(retrieved)\n",
          "    prompt = f\"{SYSTEM_PROMPT}\\n\\nContext:\\n{context}\\n\\nUser Query: {query}\\n\\nAnswer:\"\n",
          "    inputs = tokenizer(prompt, return_tensors=\"pt\", truncation=True, max_length=4096).to(model.device)\n",
          "    outputs = model.generate(**inputs, max_new_tokens=max_new_tokens)\n",
          "    response = tokenizer.decode(outputs[0], skip_special_tokens=True)\n",
          "    return response, retrieved"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# PDF ANALYZER\n",
          "def analyze_pdf(pdf_file):\n",
          "    \"\"\"Analyzes and summarizes content from an uploaded research PDF.\"\"\"\n",
          "    reader = PdfReader(pdf_file)\n",
          "    text = \"\"\n",
          "    for page in reader.pages[:5]:  # Read first 5 pages for efficiency\n",
          "        text += page.extract_text() + \"\\n\"\n",
          "    summary_prompt = f\"{SYSTEM_PROMPT}\\n\\nContext:\\n{text[:6000]}\\n\\nSummarize key findings, gaps, and directions.\"\n",
          "    inputs = tokenizer(summary_prompt, return_tensors=\"pt\", truncation=True, max_length=4096).to(model.device)\n",
          "    outputs = model.generate(**inputs, max_new_tokens=400)\n",
          "    response = tokenizer.decode(outputs[0], skip_special_tokens=True)\n",
          "    return response"
        ]
      },
      {
        cell_type: "code",
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          "# GRADIO USER INTERFACE\n",
          "with gr.Blocks(title=\"AI Research Assistant (Professional)\") as demo:\n",
          "    gr.Markdown(\"# 🧠 AI Research Assistant — Professional Version\")\n",
          "    gr.Markdown(\"A complete AI system to read, summarize, analyze, and reason about research papers.\")\n",
          "\n",
          "    # Tab 1: Research Query\n",
          "    with gr.Tab(\"📊 Research Query & Analysis\"):\n",
          "        query = gr.Textbox(label=\"Enter your research question\", lines=2, placeholder=\"e.g., Recent trends in reinforcement learning for robotics\")\n",
          "        run = gr.Button(\"🔍 Analyze Research\")\n",
          "        answer = gr.Textbox(label=\"AI Summary & Insights\", lines=8)\n",
          "        confidence = gr.Dataframe(headers=[\"Paper Title\", \"Relevance Score\"], label=\"Relevant Papers & Confidence Scores\")\n",
          "\n",
          "        def run_query(q):\n",
          "            response, retrieved = rag_generate(q)\n",
          "            table = [[p[\"title\"], p[\"score\"]] for p in retrieved]\n",
          "            return response, table\n",
          "\n",
          "        run.click(run_query, query, [answer, confidence])\n",
          "\n",
          "    # Tab 2: Chatbot\n",
          "    with gr.Tab(\"💬 Research Chatbot\"):\n",
          "        chatbot = gr.Chatbot(label=\"Chat with AI Assistant\")\n",
          "        msg = gr.Textbox(label=\"Ask a research question\")\n",
          "        state = gr.State([])\n",
          "\n",
          "        def chat_fn(message, history):\n",
          "            response, _ = rag_generate(message)\n",
          "            history.append((message, response))\n",
          "            return history, history\n",
          "\n",
          "        msg.submit(chat_fn, [msg, state], [chatbot, state])\n",
          "\n",
          "    # Tab 3: PDF Analyzer\n",
          "    with gr.Tab(\"📘 Upload PDF Paper\"):\n",
          "        pdf_file = gr.File(label=\"Upload a research PDF file\")\n",
          "        analyze_btn = gr.Button(\"🧩 Analyze PDF\")\n",
          "        pdf_result = gr.Textbox(label=\"AI Summary of PDF\", lines=10)\n",
          "\n",
          "        analyze_btn.click(lambda f: analyze_pdf(f.name), pdf_file, pdf_result)\n",
          "\n",
          "demo.launch(share=True, debug=False)"
        ]
      }
    ],
    metadata: {
      kernelspec: {
        display_name: "Python 3",
        language: "python",
        name: "python3"
      },
      language_info: {
        codemirror_mode: {
          name: "ipython",
          version: 3
        },
        file_extension: ".py",
        mimetype: "text/x-python",
        name: "python",
        nbconvert_exporter: "python",
        pygments_lexer: "ipython3",
        version: "3.10.0"
      }
    },
    nbformat: 4,
    nbformat_minor: 4
  };

  const blob = new Blob([JSON.stringify(notebookContent, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ai_research_assistant.ipynb";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
