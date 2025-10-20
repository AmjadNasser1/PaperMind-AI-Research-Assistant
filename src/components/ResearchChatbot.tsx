import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ResearchChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("research-chat", {
        body: { query: input },
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

      const assistantMessage: Message = {
        role: "assistant",
        content: data.answer,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Chat Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-secondary/20 rounded-lg">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">
            <p>Ask a research question to get started</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} ${
                msg.role === "user" ? "animate-slide-in-right" : "animate-slide-in-left"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              <Card
                className={`p-4 max-w-[80%] hover-lift ${
                  msg.role === "user"
                    ? "bg-primary/20 border-primary/30"
                    : "bg-card/50 border-border/50"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </Card>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <User className="w-5 h-5 text-accent" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <Card className="p-4 bg-card/50 border-border/50">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            </Card>
          </div>
        )}
      </div>
      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a research question..."
          className="bg-secondary/50 border-primary/30 focus:border-primary"
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-accent"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
