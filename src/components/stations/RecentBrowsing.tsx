import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useHistory, useHistoryActions } from "@/hooks/useHistory";
import { getStationById } from "@/data/stations";
import { formatFrequency } from "@/types/station";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RecentBrowsing() {
  const { history, count } = useHistory();
  const { clear } = useHistoryActions();
  const [isOpen, setIsOpen] = useState(true);

  if (count === 0) {
    return null;
  }

  return (
    <div className="radio-panel border border-radio-brass/30 bg-radio-wood/20 overflow-hidden">
      <button
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-radio-dial/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-radio-amber" />
          <span className="font-display text-sm font-semibold text-radio-cream">
            最近浏览
          </span>
          <Badge variant="outline" className="text-xs">
            {count} 条
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-radio-amber"
            onClick={(e) => {
              e.stopPropagation();
              clear();
            }}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            清空
          </Button>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-radio-brass/20 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {history.map((item) => {
              const station = getStationById(item.id);
              if (!station) return null;
              return (
                <Link
                  key={item.id}
                  to={`/station/${station.id}`}
                  className="group flex items-center gap-2 rounded-md border border-radio-brass/30 bg-radio-dial/30 px-3 py-2 text-sm hover:bg-radio-dial/50 hover:border-radio-amber/50 transition-colors"
                >
                  <span className="font-semibold text-radio-amber group-hover:underline">
                    {station.callSign}
                  </span>
                  <span className="frequency-display text-xs text-muted-foreground">
                    {formatFrequency(station.frequency)}
                  </span>
                  <Badge variant="band" className="text-[10px] px-1.5 py-0 h-4">
                    {station.band}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
