import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { stations } from "@/data/stations";
import { StationTable } from "@/components/stations/StationTable";
import { RecentBrowsing } from "@/components/stations/RecentBrowsing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BAND_OPTIONS } from "@/types/station";
import type { FrequencyBand } from "@/types/station";
import { Signal } from "lucide-react";

/**
 * 台站列表首页
 */
export function StationListPage() {
  const [searchParams] = useSearchParams();
  const bandParam = searchParams.get("band");

  const initialBandFilter = useMemo(() => {
    const validBands = BAND_OPTIONS.filter((b) => b.value !== "all").map((b) => b.value);
    if (bandParam && validBands.includes(bandParam as FrequencyBand)) {
      return bandParam as FrequencyBand;
    }
    return "all" as const;
  }, [bandParam]);

  return (
    <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
      <RecentBrowsing />
      <Card className="radio-panel border-radio-brass/30 bg-radio-wood/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Signal className="h-5 w-5 text-radio-amber" />
            <CardTitle>短波台站参考表</CardTitle>
          </div>
          <CardDescription>
            按频段或语言筛选、排序或搜索呼号。点击台站查看 Mock 收听建议。本应用仅提供参考数据，不含真实电台音频流。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StationTable data={stations} initialBandFilter={initialBandFilter} />
        </CardContent>
      </Card>
    </div>
  );
}
