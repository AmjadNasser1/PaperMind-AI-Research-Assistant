import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearchQuery } from "@/components/ResearchQuery";
import { ResearchChatbot } from "@/components/ResearchChatbot";
import { PDFAnalyzer } from "@/components/PDFAnalyzer";
import { Brain, Search, MessageSquare, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 mb-6 backdrop-blur-sm">
            <Brain className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">Powered by Advanced AI Models</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">AI Research</span>
            <br />
            <span className="text-foreground">Assistant</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced research analysis powered by neural networks. Read papers, identify gaps,
            and discover future research directions.
          </p>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="query" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary/50 backdrop-blur-sm border border-primary/30">
            <TabsTrigger value="query" className="data-[state=active]:bg-primary/20">
              <Search className="w-4 h-4 mr-2" />
              Research Query
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary/20">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="pdf" className="data-[state=active]:bg-primary/20">
              <FileText className="w-4 h-4 mr-2" />
              PDF Analyzer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-6">
            <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20">
              <ResearchQuery />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20">
              <ResearchChatbot />
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="space-y-6">
            <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20">
              <PDFAnalyzer />
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="p-4 rounded-lg bg-secondary/30 border border-primary/20 backdrop-blur-sm">
            <h3 className="font-semibold mb-2 text-primary">Read Papers</h3>
            <p className="text-sm text-muted-foreground">
              Fetch and process research from multiple AI domains
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-primary/20 backdrop-blur-sm">
            <h3 className="font-semibold mb-2 text-accent">Identify Gaps</h3>
            <p className="text-sm text-muted-foreground">
              Detect knowledge gaps using advanced NLP
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-primary/20 backdrop-blur-sm">
            <h3 className="font-semibold mb-2 text-primary">Future Directions</h3>
            <p className="text-sm text-muted-foreground">
              AI-generated research opportunity suggestions
            </p>
          </div>
        </div>
      </div>

      <footer className="py-8 px-4 mt-16 border-t border-border/50 text-center relative z-10">
        <p className="text-muted-foreground text-sm">
          Built with advanced AI • Powered by Lovable Cloud
        </p>
      </footer>
    </div>
  );
};

export default Index;
