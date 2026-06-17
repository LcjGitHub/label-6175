import { useEffect, type ComponentType } from "react";
import { ArrowLeft, Antenna, Clock, Globe, Radio, Zap } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getStationById } from "@/data/stations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatFrequency } from "@/types/station";
import { addHistory } from "@/lib/history";

/**
 * 台站详情页，展示 Mock 收听建议
 */
export function StationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const station = id ? getStationById(id) : undefined;

  useEffect(() => {
    if (station) {
      addHistory(station.id);
    }
  }, [station]);

  if (!station) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Radio className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 font-display text-xl text-radio-cream">未找到该台站</h2>
        <p className="mt-2 text-muted-foreground">ID「{id}」不存在于 Mock 数据中</p>
        <Button asChild className="mt-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-radio-amber">
        <Link to="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回台站列表
        </Link>
      </Button>

      <Card className="radio-panel border-radio-brass/40 bg-radio-wood/40 overflow-hidden">
        <div className="border-b border-radio-brass/20 bg-radio-dial/40 px-6 py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-radio-brass/50 bg-radio-dial shadow-dial">
            <Radio className="h-8 w-8 text-radio-amber animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <h1 className="font-display text-2xl font-bold text-radio-cream">{station.callSign}</h1>
            <FavoriteButton id={station.id} size="lg" />
          </div>
          <p className="mt-2 frequency-display text-3xl">{formatFrequency(station.frequency)}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="band">{station.band} 波段</Badge>
            <Badge variant="outline">{station.language}</Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-lg">台站信息</CardTitle>
          <CardDescription>Mock 参考数据，仅供查阅</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <InfoItem icon={Clock} label="播出时段" value={station.timeSlot} />
            <InfoItem icon={Globe} label="目标区域" value={station.targetRegion ?? "—"} />
            <InfoItem icon={Zap} label="发射功率" value={station.power ?? "—"} />
            <InfoItem icon={Antenna} label="频段" value={`${station.band} 米波`} />
          </dl>
        </CardContent>
      </Card>

      <Card className="radio-panel border-radio-brass/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-radio-amber animate-pulse" />
            收听建议
          </CardTitle>
          <CardDescription>基于 Mock 数据的参考性收听提示（非实时传播预报）</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-radio-brass/20 bg-radio-dial/30 p-5">
            <p className="leading-relaxed text-radio-cream/90 whitespace-pre-wrap">
              {station.listeningAdvice}
            </p>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            提示：实际接收效果受太阳活动、季节、天线与本地干扰等因素影响。本页面不提供音频流或在线收听功能。
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/** 详情信息项 */
function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-border/50 bg-secondary/30 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-radio-amber" />
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 text-sm font-medium">{value}</dd>
      </div>
    </div>
  );
}
