import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/copy";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
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

export function CopyButton({ text, size = "md", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizes = sizeMap[size];

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        sizes.button,
        copied
          ? "text-green-500 hover:text-green-400"
          : "text-muted-foreground hover:text-radio-amber",
        "transition-all duration-200",
        className
      )}
      aria-label={copied ? "已复制" : "复制"}
      title={copied ? "已复制" : "复制"}
    >
      {copied ? (
        <Check className={cn(sizes.icon, "transition-all duration-200")} />
      ) : (
        <Copy className={cn(sizes.icon, "transition-all duration-200")} />
      )}
    </Button>
  );
}
