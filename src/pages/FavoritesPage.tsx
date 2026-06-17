import { useMemo } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { stations } from "@/data/stations";
import { StationTable } from "@/components/stations/StationTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

/**
 * 收藏台站列表页
 */
export function FavoritesPage() {
  const { favorites } = useFavorites();

  const favoriteStations = useMemo(() => {
    const idSet = new Set(favorites);
    return stations.filter((s) => idSet.has(s.id));
  }, [favorites]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-radio-amber">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回全部台站
          </Link>
        </Button>
      </div>

      <Card className="radio-panel border-radio-brass/30 bg-radio-wood/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star
              className={cn(
                "h-5 w-5 text-radio-amber",
                favoriteStations.length > 0
                  ? "fill-current drop-shadow-[0_0_4px_rgba(255,179,71,0.5)]"
                  : ""
              )}
            />
            <CardTitle>我的收藏台站</CardTitle>
          </div>
          <CardDescription>
            你收藏了 <span className="text-radio-amber font-semibold">{favoriteStations.length}</span> 个台站。
            点击星形图标可取消收藏，数据保存在浏览器本地存储中。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StationTable data={favoriteStations} emptyText="尚未收藏任何台站" />
        </CardContent>
      </Card>
    </div>
  );
}
