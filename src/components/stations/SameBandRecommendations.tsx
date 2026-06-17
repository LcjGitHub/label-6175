import { Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { getSameBandStations } from "@/data/stations";
import { formatFrequency } from "@/types/station";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * 同频段推荐组件属性
 */
interface SameBandRecommendationsProps {
  /** 当前台站 ID，用于排除自身并查找同频段其他台站 */
  stationId: string;
  /** 最多推荐条数，默认 5 条 */
  limit?: number;
}

/**
 * 同频段推荐区块
 * 展示与当前台站属于同一频段的其他台站（最多 5 条，按频率从低到高排序）；
 * 每条记录显示呼号、频率与语言，点击可快速跳转至对应台站详情页；
 * 无同频段推荐台站时显示「暂无推荐」提示。
 */
export function SameBandRecommendations({ stationId, limit = 5 }: SameBandRecommendationsProps) {
  const recommendations = getSameBandStations(stationId, limit);

  return (
    <Card className="radio-panel border-radio-brass/30">
      <CardHeader>
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold leading-none tracking-tight text-radio-cream">
          <Radio className="h-4 w-4 text-radio-amber" />
          同频段推荐
        </h2>
        <CardDescription>同一波段的其他台站，方便您切换收听</CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 ? (
          <div className="space-y-2">
            {recommendations.map((station) => (
              <Link
                key={station.id}
                to={`/station/${station.id}`}
                className="group flex items-center justify-between rounded-md border border-radio-brass/20 bg-radio-dial/20 px-4 py-3 hover:bg-radio-dial/40 hover:border-radio-amber/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-radio-brass/30 bg-radio-dial/50">
                    <Radio className="h-4 w-4 text-radio-amber" />
                  </div>
                  <div>
                    <div className="font-semibold text-radio-cream group-hover:text-radio-amber transition-colors">
                      {station.callSign}
                    </div>
                    <div className="frequency-display text-xs text-muted-foreground">
                      {formatFrequency(station.frequency)}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {station.language}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-radio-brass/30 bg-radio-dial/10 py-8 text-center">
            <Radio className="mx-auto h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">暂无推荐</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
