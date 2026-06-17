import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/copy";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "success" | "error";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const success = await copyToClipboard(text);
    setState(success ? "success" : "error");
    setTimeout(() => setState("idle"), 2000);
  };

  const stateConfig = {
    idle: {
      label: "复制",
      icon: Copy,
      textClass: "text-muted-foreground hover:text-radio-amber",
    },
    success: {
      label: "已复制",
      icon: Check,
      textClass: "text-green-500 hover:text-green-400",
    },
    error: {
      label: "复制失败",
      icon: X,
      textClass: "text-red-500 hover:text-red-400",
    },
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "h-7 gap-1.5 px-2 text-xs",
        config.textClass,
        "transition-all duration-200",
        className
      )}
      aria-label={config.label}
      title={config.label}
    >
      <Icon className="h-3.5 w-3.5 shrink-0 transition-all duration-200" />
      <span className="transition-all duration-200">{config.label}</span>
    </Button>
  );
}
