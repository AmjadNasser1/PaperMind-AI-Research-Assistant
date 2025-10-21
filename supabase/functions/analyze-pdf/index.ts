import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdfText } = await req.json();
    
    if (!pdfText) {
      return new Response(
        JSON.stringify({ error: "PDF text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an AI Research Assistant analyzing a research paper.

Your analysis should include:

1. **KEY FINDINGS & CONTRIBUTIONS**
   - Main discoveries and their significance
   - Novel contributions to the field
   - Important results and claims

2. **METHODOLOGY OVERVIEW**
   - Research approach and design
   - Techniques and tools used
   - Data sources and experimental setup

3. **KNOWLEDGE GAPS IDENTIFIED**
   - Limitations acknowledged by authors
   - Missing links in the research
   - Unexplored areas or questions
   - Conflicting findings with existing literature

4. **FUTURE RESEARCH DIRECTIONS**
   - Concrete next steps suggested by findings
   - Potential applications and extensions
   - Open problems that need addressing
   - Interdisciplinary opportunities

5. **KEYWORDS**
   - Extract 5-10 key technical terms and concepts

Provide a thorough, structured analysis.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Analyze this research paper:\n\n${pdfText.substring(0, 12000)}` }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || "No analysis generated";

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-pdf function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
