import { useEffect, useState } from "react";
import papermindLogo from "@/assets/papermind.jpg";
import { removeBackground, loadImage } from "@/utils/removeBackground";

export const Logo = () => {
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processLogo = async () => {
      try {
        const response = await fetch(papermindLogo);
        const blob = await response.blob();
        const img = await loadImage(blob);
        const processedBlob = await removeBackground(img);
        const url = URL.createObjectURL(processedBlob);
        setProcessedLogo(url);
      } catch (error) {
        console.error("Failed to process logo:", error);
        setProcessedLogo(papermindLogo);
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, []);

  if (isProcessing) {
    return (
      <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse" />
    );
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-smooth animate-pulse-glow" />
      <img
        src={processedLogo || papermindLogo}
        alt="PaperMind Logo"
        className="relative w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.8)] transition-smooth"
      />
    </div>
  );
};
