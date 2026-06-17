import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  id: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: {
    button: "h-7 w-7 p-0",
    icon: "h-3.5 w-3.5",
  },
  md: {
    button: "h-8 w-8 p-0",
    icon: "h-4 w-4",
  },
  lg: {
    button: "h-10 w-10 p-0",
    icon: "h-5 w-5",
  },
};

export function FavoriteButton({ id, size = "md", className }: FavoriteButtonProps) {
  const { isFav, toggle } = useFavorite(id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };

  const sizes = sizeMap[size];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        sizes.button,
        isFav
          ? "text-radio-amber hover:text-radio-amber/80"
          : "text-muted-foreground hover:text-radio-amber",
        "transition-all duration-200",
        isFav && "drop-shadow-[0_0_4px_rgba(255,179,71,0.5)]",
        className
      )}
      aria-label={isFav ? "取消收藏" : "添加收藏"}
      title={isFav ? "取消收藏" : "添加收藏"}
    >
      <Star
        className={cn(sizes.icon, "transition-all duration-200", isFav ? "fill-current" : "")}
      />
    </Button>
  );
}
