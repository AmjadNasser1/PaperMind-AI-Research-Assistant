import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ResearchQuery = () => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!query.trim()) {
      toast({
        title: "Query Required",
        description: "Please enter a research question",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnswer("");

    try {
      const mockContext = `Recent research in ${query.toLowerCase()} shows significant advancements in machine learning applications, neural network architectures, and computational efficiency.`;

      const { data, error } = await supabase.functions.invoke("research-chat", {
        body: { query, context: mockContext },
      });

      if (error) {
        if (error.message.includes("429")) {
          toast({
            title: "Rate Limit",
            description: "Too many requests. Please wait a moment.",
            variant: "destructive",
          });
        } else if (error.message.includes("402")) {
          toast({
            title: "Credits Required",
            description: "Please add credits to your workspace.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze research. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">
          Enter your research question
        </label>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Recent trends in reinforcement learning for robotics"
          className="min-h-[100px] bg-secondary/50 border-primary/30 focus:border-primary"
        />
        <Button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analyze Research
            </>
          )}
        </Button>
      </div>

      {answer && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/30 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 gradient-text">
            AI Summary & Insights
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {answer}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
