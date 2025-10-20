import { Card } from "@/components/ui/card";
import { BookOpen, Brain, Search, MessageSquare, FileText, Sparkles } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Read Research Papers",
    description: "Automatically fetch and process papers from ArXiv across multiple AI domains",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: "Summarize Findings",
    description: "AI-powered summarization using Qwen2.5-7B for clear, concise insights",
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Search,
    title: "Identify Gaps",
    description: "Detect knowledge gaps in current literature using advanced NLP techniques",
    color: "from-teal-500 to-blue-500",
  },
  {
    icon: Sparkles,
    title: "Future Directions",
    description: "AI-generated suggestions for promising research opportunities",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: MessageSquare,
    title: "Interactive Chatbot",
    description: "Ask questions and get intelligent responses based on research context",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "PDF Analysis",
    description: "Upload and analyze your own research papers with AI-powered extraction",
    color: "from-pink-500 to-blue-500",
  },
];

export const FeaturesGrid = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Comprehensive</span> Research Tools
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to accelerate your AI research workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
