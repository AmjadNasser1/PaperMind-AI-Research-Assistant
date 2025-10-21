import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, BookOpen, Calendar, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  link: string;
  domain: string;
}

export const ArxivSearch = () => {
  const [customDomain, setCustomDomain] = useState("");
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const defaultDomains = [
    "computer vision machine learning",
    "natural language processing",
    "bioinformatics",
    "robotics",
    "cybersecurity",
    "climate modeling machine learning"
  ];

  const handleSearch = async (domains?: string[]) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-arxiv", {
        body: { 
          domains: domains || defaultDomains,
          maxResultsPerDomain: 15
        },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setPapers(data.papers);
      toast({
        title: "Success",
        description: `Fetched ${data.count} research papers from ArXiv`,
      });
    } catch (error) {
      console.error("Error fetching papers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch papers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSearch = () => {
    if (!customDomain.trim()) {
      toast({
        title: "Error",
        description: "Please enter a research domain",
        variant: "destructive",
      });
      return;
    }
    handleSearch([customDomain]);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            ArXiv Research Papers
          </CardTitle>
          <CardDescription>
            Fetch papers from multiple AI research domains or search custom topics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Fetching Papers...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Default Domains
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {defaultDomains.map((domain, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {domain}
              </Badge>
            ))}
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Or search custom domain:</p>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., quantum computing machine learning"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCustomSearch()}
              />
              <Button onClick={handleCustomSearch} disabled={isLoading} variant="secondary">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {papers.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-primary/30">
          <CardHeader>
            <CardTitle>Research Papers ({papers.length})</CardTitle>
            <CardDescription>
              Click on papers to read abstracts and access full texts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {papers.map((paper, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`paper-${idx}`}
                  className="border border-primary/20 rounded-lg px-4 bg-secondary/20"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start gap-2 text-left">
                      <h3 className="font-semibold text-sm">{paper.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {paper.domain}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{paper.authors.slice(0, 3).join(", ")}{paper.authors.length > 3 ? " et al." : ""}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(paper.published).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {paper.summary}
                    </p>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(paper.link, "_blank")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View on ArXiv
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
