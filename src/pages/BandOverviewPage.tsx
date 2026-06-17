import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BarChart2, Radio, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { computeBandStats, getTotalStationCount, getUniqueLanguageCount } from "@/lib/band-stats";

export function BandOverviewPage() {
  const bandStats = useMemo(() => computeBandStats(), []);
  const totalStations = useMemo(() => getTotalStationCount(), []);
  const uniqueLanguages = useMemo(() => getUniqueLanguageCount(), []);
  const activeBands = useMemo(() => bandStats.filter((b) => b.total > 0).length, [bandStats]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Card className="radio-panel border-radio-brass/30 bg-radio-wood/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-radio-amber" />
            <CardTitle>频段统计概览</CardTitle>
          </div>
          <CardDescription>
            按米波频段统计台站分布情况。点击任意频段卡片可跳转到台站列表并自动筛选对应频段。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="radio-panel rounded-lg border border-radio-brass/20 bg-radio-dial/20 p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Radio className="h-3 w-3" />
                <span>总台站数</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-radio-amber">{totalStations}</div>
            </div>
            <div className="radio-panel rounded-lg border border-radio-brass/20 bg-radio-dial/20 p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <BarChart2 className="h-3 w-3" />
                <span>活跃频段</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-radio-amber">{activeBands}</div>
            </div>
            <div className="radio-panel rounded-lg border border-radio-brass/20 bg-radio-dial/20 p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Users className="h-3 w-3" />
                <span>语言种类</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-radio-amber">{uniqueLanguages}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bandStats.map((stat) => (
          <Link
            key={stat.band}
            to={`/?band=${stat.band}`}
            className="group block transition-transform hover:-translate-y-0.5"
          >
            <Card
              className={`radio-panel h-full border transition-all duration-200 ${
                stat.total > 0
                  ? "border-radio-brass/30 bg-radio-wood/20 hover:border-radio-amber/60 hover:shadow-[0_0_16px_rgba(255,179,71,0.15)]"
                  : "border-radio-brass/10 bg-radio-wood/10 opacity-60"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="band">{stat.band}</Badge>
                      <CardTitle className="text-base">{stat.label}</CardTitle>
                    </div>
                    <CardDescription className="mt-1 text-xs">{stat.range}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">台站数</div>
                    <div
                      className={`text-2xl font-bold ${
                        stat.total > 0 ? "text-radio-amber" : "text-muted-foreground"
                      }`}
                    >
                      {stat.total}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {stat.languages.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">语言分布</div>
                    <div className="flex flex-wrap gap-1.5">
                      {stat.languages.map((lang) => (
                        <div
                          key={lang.language}
                          className="flex items-center gap-1 rounded-md border border-radio-brass/20 bg-radio-dial/30 px-2 py-1"
                        >
                          <span className="text-xs text-radio-cream">{lang.language}</span>
                          <span className="rounded-full bg-radio-amber/20 px-1.5 py-0.5 text-[10px] font-semibold text-radio-amber">
                            {lang.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground">暂无台站数据</div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
