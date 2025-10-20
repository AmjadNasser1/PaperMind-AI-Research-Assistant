import { Button } from "@/components/ui/button";
import { Download, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onDownload: () => void;
}

export const HeroSection = ({ onDownload }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Powered by Advanced AI Models</span>
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="gradient-text">AI Research</span>
          <br />
          <span className="text-foreground">Assistant</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Advanced research analysis powered by neural networks. Read papers, identify gaps,
          and discover future research directions with AI-driven insights.
        </p>

        <Button
          size="lg"
          onClick={onDownload}
          className="group relative bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-6 text-lg rounded-xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
        >
          <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          Download for Google Colab
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity" />
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          Ready to run • No setup required • Free on Colab
        </p>
      </div>
    </section>
  );
};
