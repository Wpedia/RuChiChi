export const getReactionAnimation = (emoji: string, isAnimating: boolean): string => {
  if (!isAnimating) return "";
  
  switch (emoji) {
    case "❤️":
      return "animate-heartbeat";
    case "👍":
    case "👎":
      return "animate-bounce-rotate";
    case "😂":
      return "animate-shake";
    case "😮":
      return "animate-pop";
    case "😢":
      return "animate-wobble";
    case "🎉":
      return "animate-tada";
    case "🔥":
      return "animate-flame";
    default:
      return "animate-pop";
  }
};
