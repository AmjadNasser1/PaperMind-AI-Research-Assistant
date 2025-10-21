import logo from "@/assets/logo_no_wallpaper.png";

export const Logo = () => {
  return (
    <div className="relative group">
      {/* Pulsing glow background */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-smooth animate-pulse-glow" />
      
      {/* Multiple edge highlight layers */}
      <div className="absolute -inset-2 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50 animate-pulse" />
      
      <img
        src={logo}
        alt="PaperMind Logo"
        className="relative w-20 h-20 md:w-24 md:h-24 object-contain animate-float
                   hover:scale-110 transition-all duration-500
                   [filter:drop-shadow(0_0_12px_rgba(59,130,246,0.6))_drop-shadow(0_0_20px_rgba(34,211,238,0.4))]
                   hover:[filter:drop-shadow(0_0_20px_rgba(59,130,246,0.9))_drop-shadow(0_0_35px_rgba(34,211,238,0.7))]"
      />
    </div>
  );
};
