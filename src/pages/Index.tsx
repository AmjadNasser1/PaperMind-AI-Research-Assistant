import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResearchQuery } from "@/components/ResearchQuery";
import { ResearchChatbot } from "@/components/ResearchChatbot";
import { PDFAnalyzer } from "@/components/PDFAnalyzer";
import { Brain, Search, MessageSquare, FileText, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

const Index = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
        <div className="absolute top-40 right-1/3 w-48 h-48 bg-accent/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-primary/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        
        {/* Rotating glow effects */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl animate-rotate-slow" />
        <div className="absolute bottom-1/4 left-1/2 w-40 h-40 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-xl animate-rotate-slow" style={{ animationDelay: "-10s" }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header with Logo */}
        <div className="text-center mb-12 animate-slide-up">
          {/* Logo and Badge */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Logo />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/30 backdrop-blur-sm hover-lift">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text animate-slide-in-left inline-block">Paper</span>
            <span className="gradient-text animate-slide-in-right inline-block">Mind</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
            Advanced research analysis powered by neural networks. Read papers, identify gaps,
            and discover future research directions.
          </p>
        </div>

        {/* Main Interface */}
        <Tabs defaultValue="query" className="w-full animate-slide-up stagger-2">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary/50 backdrop-blur-sm border border-primary/30 hover-lift">
            <TabsTrigger value="query" className="data-[state=active]:bg-primary/20 transition-all duration-300">
              <Search className="w-4 h-4 mr-2" />
              Research Query
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary/20 transition-all duration-300">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="pdf" className="data-[state=active]:bg-primary/20 transition-all duration-300">
              <FileText className="w-4 h-4 mr-2" />
              PDF Analyzer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="query" className="space-y-6">
            <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover-lift animate-slide-up">
              <ResearchQuery />
            </div>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover-lift animate-slide-up">
              <ResearchChatbot />
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="space-y-6">
            <div className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-primary/20 hover-lift animate-slide-up">
              <PDFAnalyzer />
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="p-4 rounded-lg bg-secondary/30 border border-primary/20 backdrop-blur-sm hover-lift animate-slide-up stagger-1">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary animate-pulse" />
              <h3 className="font-semibold text-primary">Read Papers</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Fetch and process research from multiple AI domains
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-primary/20 backdrop-blur-sm hover-lift animate-slide-up stagger-2">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-5 h-5 text-accent animate-pulse" />
              <h3 className="font-semibold text-accent">Identify Gaps</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Detect knowledge gaps using advanced NLP
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 border border-primary/20 backdrop-blur-sm hover-lift animate-slide-up stagger-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <h3 className="font-semibold text-primary">Future Directions</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-generated research opportunity suggestions
            </p>
          </div>
        </div>
      </div>

      <footer className="py-8 px-4 mt-16 border-t border-border/50 text-center relative z-10 animate-slide-up stagger-3">
        <p className="text-muted-foreground text-sm">
          Built with advanced AI • Powered by Lovable Cloud
        </p>
      </footer>
    </div>
  );
};

export default Index;
