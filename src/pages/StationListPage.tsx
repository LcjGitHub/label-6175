import { stations } from "@/data/stations";
import { StationTable } from "@/components/stations/StationTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Signal } from "lucide-react";

/**
 * 台站列表首页
 */
export function StationListPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Card className="radio-panel border-radio-brass/30 bg-radio-wood/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Signal className="h-5 w-5 text-radio-amber" />
            <CardTitle>短波台站参考表</CardTitle>
          </div>
          <CardDescription>
            按频段筛选、排序或搜索呼号。点击台站查看 Mock 收听建议。本应用仅提供参考数据，不含真实电台音频流。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StationTable data={stations} />
        </CardContent>
      </Card>
    </div>
  );
}
