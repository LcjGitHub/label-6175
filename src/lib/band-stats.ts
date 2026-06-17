import { stations } from "@/data/stations";
import { BAND_OPTIONS } from "@/types/station";
import type { FrequencyBand, Station } from "@/types/station";

/**
 * 单语言计数项
 */
export interface LanguageCount {
  language: string;
  count: number;
}

/**
 * 单频段统计数据
 */
export interface BandStat {
  band: FrequencyBand;
  label: string;
  range: string;
  total: number;
  languages: LanguageCount[];
}

/**
 * 按频段聚合台站统计数据，包含各频段总台站数与语言分布（按数量降序）
 */
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

/**
 * 获取总台站数
 */
export function getTotalStationCount(stationList: Station[] = stations): number {
  return stationList.length;
}

/**
 * 获取不重复的语言种类数
 */
export function getUniqueLanguageCount(stationList: Station[] = stations): number {
  const langs = new Set(stationList.map((s) => s.language));
  return langs.size;
}

/**
 * 语言下拉选项
 */
export interface LanguageOption {
  value: string;
  label: string;
}

/**
 * 从台站列表中提取去重且排序的语言选项，首项为「全部语言」
 * 用于表格上方语言筛选下拉框，随台站数据动态更新
 */
export function extractLanguageOptions(stationList: Station[] = stations): LanguageOption[] {
  const langs = Array.from(new Set(stationList.map((s) => s.language))).sort();
  return [
    { value: "all", label: "全部语言" },
    ...langs.map((l) => ({ value: l, label: l })),
  ];
}
