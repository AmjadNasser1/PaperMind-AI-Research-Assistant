import { HeroSection } from "@/components/HeroSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { TechStack } from "@/components/TechStack";
import { generateNotebook } from "@/utils/generateNotebook";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    generateNotebook();
    toast({
      title: "Download Started",
      description: "Your AI Research Assistant notebook is ready for Google Colab!",
    });
  };

  return (
    <div className="min-h-screen">
      <HeroSection onDownload={handleDownload} />
      <FeaturesGrid />
      <TechStack />
      
      <footer className="py-12 px-4 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            Built with advanced AI • Powered by Qwen2.5-7B • Open Source Ready
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
