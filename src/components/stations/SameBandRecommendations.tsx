import { Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { getSameBandStations } from "@/data/stations";
import { formatFrequency } from "@/types/station";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SameBandRecommendationsProps {
  stationId: string;
  limit?: number;
}

export function SameBandRecommendations({ stationId, limit = 5 }: SameBandRecommendationsProps) {
  const recommendations = getSameBandStations(stationId, limit);

  return (
    <Card className="radio-panel border-radio-brass/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-radio-amber" />
          同频段推荐
        </CardTitle>
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
            <p className="mt-2 text-sm text-muted-foreground">暂无同频段推荐台站</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
