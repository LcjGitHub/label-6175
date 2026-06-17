import { ArrowLeft, Clock, Globe, Radio, Zap } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { getStationById } from "@/data/stations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFrequency } from "@/types/station";
import type { Station } from "@/types/station";
import { clearCompare } from "@/lib/compare";
import { useEffect } from "react";

/**
 * 台站对比页面，以并排卡片形式对比所选台站的信息
 */
export function StationComparePage() {
  const [searchParams] = useSearchParams();
  const idsParam = searchParams.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : [];

  const stations: Station[] = ids
    .map((id) => getStationById(id))
    .filter((s): s is Station => s !== undefined);

  useEffect(() => {
    return () => {
      clearCompare();
    };
  }, []);

  if (stations.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Radio className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 font-display text-xl text-radio-cream">未选择对比台站</h2>
        <p className="mt-2 text-muted-foreground">请先从列表中选择要对比的台站</p>
        <Button asChild className="mt-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Link>
        </Button>
      </div>
    );
  }

  const compareFields = [
    { key: "frequency", label: "频率", icon: Radio },
    { key: "band", label: "频段", icon: Radio },
    { key: "language", label: "语言", icon: Globe },
    { key: "timeSlot", label: "时段", icon: Clock },
    { key: "power", label: "功率", icon: Zap },
    { key: "targetRegion", label: "目标区域", icon: Globe },
  ] as const;

  const getFieldValue = (station: Station, field: typeof compareFields[number]["key"]): string => {
    switch (field) {
      case "frequency":
        return formatFrequency(station.frequency);
      case "band":
        return `${station.band} 米波`;
      default:
        return station[field] ?? "—";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-radio-amber">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回台站列表
          </Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          共 {stations.length} 个台站对比中
        </div>
      </div>

      <div className="text-center">
        <h1 className="font-display text-2xl font-bold text-radio-cream">台站对比</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          对比呼号、频率、频段、语言、时段、功率和目标区域
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {stations.map((station) => (
            <Card
              key={station.id}
              className="radio-panel border-radio-brass/40 bg-radio-wood/40 w-[320px] shrink-0 overflow-hidden"
            >
              <div className="border-b border-radio-brass/20 bg-radio-dial/40 px-6 py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-radio-brass/50 bg-radio-dial shadow-dial">
                  <Radio className="h-6 w-6 text-radio-amber" />
                </div>
                <h2 className="font-display text-xl font-bold text-radio-cream">{station.callSign}</h2>
                <p className="mt-1 frequency-display text-lg text-radio-amber">
                  {formatFrequency(station.frequency)}
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  <Badge variant="band">{station.band} 波段</Badge>
                  <Badge variant="outline">{station.language}</Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                {compareFields.map((field) => {
                  const Icon = field.icon;
                  const value = getFieldValue(station, field.key);
                  return (
                    <div
                      key={field.key}
                      className="flex items-start gap-3 rounded-md border border-border/50 bg-secondary/30 p-3"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-radio-amber" />
                      <div className="min-w-0 flex-1">
                        <dt className="text-xs text-muted-foreground">{field.label}</dt>
                        <dd className="mt-0.5 text-sm font-medium truncate" title={value}>
                          {value}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="radio-panel border-radio-brass/30">
        <CardHeader>
          <CardTitle className="text-lg">对比说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• 呼号：电台的唯一标识符，用于在波段内区分不同电台</p>
            <p>• 频率：电台发射信号的载波频率，单位为千赫兹（kHz）</p>
            <p>• 频段：根据波长划分的频率范围，不同频段的传播特性各异</p>
            <p>• 语言：电台广播使用的主要语言</p>
            <p>• 时段：电台的主要播出时间，可能受季节和传播条件调整</p>
            <p>• 功率：发射功率大小，影响信号覆盖范围和接收效果</p>
            <p>• 目标区域：电台主要面向的广播覆盖区域</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
