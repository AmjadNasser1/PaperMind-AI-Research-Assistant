import { Badge } from "@/components/ui/badge";

const technologies = [
  "Qwen2.5-7B-Instruct",
  "Sentence Transformers",
  "FAISS Vector Search",
  "ArXiv Integration",
  "PyPDF2",
  "Gradio UI",
  "4-bit Quantization",
  "NLTK",
  "YAKE Keywords",
];

export const TechStack = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by <span className="gradient-text">Cutting-Edge AI</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Built with the latest in machine learning and NLP technology
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {technologies.map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-4 py-2 text-sm bg-secondary/70 backdrop-blur-sm border border-primary/30 hover:border-primary hover:bg-secondary transition-all duration-300 hover:scale-110"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};
