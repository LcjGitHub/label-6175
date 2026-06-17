import { Radio } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * 应用顶部导航栏，复古收音机风格
 */
export function AppHeader() {
  return (
    <header className="border-b border-radio-brass/30 bg-radio-wood/60 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-radio-brass/60 bg-radio-dial shadow-dial">
            <Radio className="h-5 w-5 text-radio-amber group-hover:animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-radio-cream group-hover:text-radio-amber transition-colors">
              短波台站 Mock 参考表
            </h1>
            <p className="text-xs text-muted-foreground">Shortwave Station Reference · Mock Data Only</p>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500/80 animate-pulse" />
          <span>参考数据 · 无真实音频流</span>
        </div>
      </div>
    </header>
  );
}
