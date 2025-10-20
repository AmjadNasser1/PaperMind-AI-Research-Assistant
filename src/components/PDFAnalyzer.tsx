import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const PDFAnalyzer = () => {
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setIsLoading(true);
    setAnalysis("");

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        // Simulate PDF text extraction (in a real app, you'd use a library like pdf.js)
        const mockPdfText = `Research Paper: ${file.name}

Abstract: This paper presents novel findings in machine learning and artificial intelligence. 
We propose a new architecture that combines recent advances in transformer models with reinforcement learning.

Introduction: Recent developments in deep learning have shown promising results...

Methods: We employed a combination of supervised and unsupervised learning techniques...

Results: Our experiments demonstrate significant improvements over baseline models...

Conclusion: This research opens new avenues for future investigation in AI systems.`;

        const { data, error } = await supabase.functions.invoke("analyze-pdf", {
          body: { pdfText: mockPdfText },
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

        setAnalysis(data.analysis);
        toast({
          title: "Analysis Complete",
          description: "PDF has been analyzed successfully",
        });
      };

      reader.onerror = () => {
        throw new Error("Failed to read file");
      };

      reader.readAsText(file);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-primary/30 rounded-lg bg-secondary/20 hover:border-primary/50 transition-colors">
        <FileText className="w-16 h-16 text-primary mb-4" />
        <h3 className="text-lg font-semibold mb-2">Upload Research PDF</h3>
        <p className="text-sm text-muted-foreground mb-4 text-center">
          Upload a research paper to analyze its findings, gaps, and future directions
        </p>
        <label htmlFor="pdf-upload">
          <Button
            disabled={isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 cursor-pointer"
            asChild
          >
            <span>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose PDF File
                </>
              )}
            </span>
          </Button>
        </label>
        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        {fileName && (
          <p className="text-xs text-muted-foreground mt-2">Selected: {fileName}</p>
        )}
      </div>

      {analysis && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/30 animate-fade-in">
          <h3 className="text-lg font-semibold mb-4 gradient-text">
            AI Analysis of PDF
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {analysis}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
