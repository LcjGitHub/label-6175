import { stations } from "@/data/stations";
import { BAND_OPTIONS } from "@/types/station";
import type { FrequencyBand, Station } from "@/types/station";

export interface LanguageCount {
  language: string;
  count: number;
}

export interface BandStat {
  band: FrequencyBand;
  label: string;
  range: string;
  total: number;
  languages: LanguageCount[];
}

export function computeBandStats(stationList: Station[] = stations): BandStat[] {
  const bandMap = new Map<FrequencyBand, BandStat>();

  BAND_OPTIONS.forEach((opt) => {
    if (opt.value !== "all") {
      bandMap.set(opt.value, {
        band: opt.value,
        label: opt.label,
        range: opt.range,
        total: 0,
        languages: [],
      });
    }
  });

  const languageCounters = new Map<FrequencyBand, Map<string, number>>();

  stationList.forEach((station) => {
    const stat = bandMap.get(station.band);
    if (!stat) return;

    stat.total += 1;

    let langMap = languageCounters.get(station.band);
    if (!langMap) {
      langMap = new Map<string, number>();
      languageCounters.set(station.band, langMap);
    }
    langMap.set(station.language, (langMap.get(station.language) || 0) + 1);
  });

  const result: BandStat[] = [];
  BAND_OPTIONS.forEach((opt) => {
    if (opt.value === "all") return;
    const stat = bandMap.get(opt.value)!;
    const langMap = languageCounters.get(opt.value);
    if (langMap) {
      stat.languages = Array.from(langMap.entries())
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);
    }
    result.push(stat);
  });

  return result;
}

export function getTotalStationCount(stationList: Station[] = stations): number {
  return stationList.length;
}

export function getUniqueLanguageCount(stationList: Station[] = stations): number {
  const langs = new Set(stationList.map((s) => s.language));
  return langs.size;
}
