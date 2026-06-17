import { BarChart2, Radio, Star } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useFavoritesCount } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

/**
 * 应用顶部导航栏，复古收音机风格
 */
export function AppHeader() {
  const count = useFavoritesCount();
  const location = useLocation();
  const isOverviewActive = location.pathname === "/频段概览";
  const isFavoritesActive = location.pathname === "/收藏";

  const navBtnBaseCls = (active: boolean) =>
    cn(
      "border-radio-brass/40 bg-radio-dial/30 transition-all",
      active
        ? "border-radio-amber/80 bg-radio-amber/20 shadow-[0_0_8px_rgba(255,179,71,0.3)]"
        : "hover:bg-accent/20 hover:border-radio-brass/60"
    );

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
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className={navBtnBaseCls(isOverviewActive)}
          >
            <Link to="/频段概览">
              <BarChart2
                className={cn(
                  "h-4 w-4 transition-all",
                  isOverviewActive ? "text-radio-amber drop-shadow-[0_0_3px_rgba(255,179,71,0.6)]" : "text-radio-amber"
                )}
              />
              <span className={cn("text-xs", isOverviewActive ? "text-radio-amber font-semibold" : "text-radio-cream")}>
                频段概览
              </span>
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="sm"
            className={navBtnBaseCls(isFavoritesActive)}
          >
            <Link to="/收藏">
              <Star
                className={cn(
                  "h-4 w-4 text-radio-amber transition-all",
                  count > 0 ? "fill-current drop-shadow-[0_0_4px_rgba(255,179,71,0.5)]" : ""
                )}
              />
              <span className={cn("text-xs", isFavoritesActive ? "text-radio-amber font-semibold" : "text-radio-cream")}>
                收藏
              </span>
              <span className="ml-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-radio-amber/20 px-1.5 py-0.5 text-xs font-semibold text-radio-amber">
                {count}
              </span>
            </Link>
          </Button>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500/80 animate-pulse" />
            <span>参考数据 · 无真实音频流</span>
          </div>
        </div>
      </div>
    </header>
  );
}
