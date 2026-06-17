/**
 * 短波频段定义
 */
export type FrequencyBand =
  | "49m"
  | "41m"
  | "31m"
  | "25m"
  | "22m"
  | "19m"
  | "16m"
  | "15m"
  | "13m";

/**
 * 台站数据结构
 */
export interface Station {
  id: string;
  callSign: string;
  /** 频率，单位 kHz */
  frequency: number;
  language: string;
  /** 播出时段描述 */
  timeSlot: string;
  band: FrequencyBand;
  /** 详情页收听建议 */
  listeningAdvice: string;
  /** 发射功率描述 */
  power?: string;
  /** 目标区域 */
  targetRegion?: string;
}

/**
 * 频段选项，含 kHz 范围说明
 */
export const BAND_OPTIONS: { value: FrequencyBand | "all"; label: string; range: string }[] = [
  { value: "all", label: "全部频段", range: "" },
  { value: "49m", label: "49 米波", range: "5900–6200 kHz" },
  { value: "41m", label: "41 米波", range: "7200–7450 kHz" },
  { value: "31m", label: "31 米波", range: "9400–9900 kHz" },
  { value: "25m", label: "25 米波", range: "11600–12100 kHz" },
  { value: "22m", label: "22 米波", range: "13570–13870 kHz" },
  { value: "19m", label: "19 米波", range: "15100–15800 kHz" },
  { value: "16m", label: "16 米波", range: "17480–17900 kHz" },
  { value: "15m", label: "15 米波", range: "18900–19020 kHz" },
  { value: "13m", label: "13 米波", range: "21500–21850 kHz" },
];

/**
 * 根据频率 kHz 推断频段
 */
export function getBandFromFrequency(freq: number): FrequencyBand {
  if (freq >= 5900 && freq <= 6200) return "49m";
  if (freq >= 7200 && freq <= 7450) return "41m";
  if (freq >= 9400 && freq <= 9900) return "31m";
  if (freq >= 11600 && freq <= 12100) return "25m";
  if (freq >= 13570 && freq <= 13870) return "22m";
  if (freq >= 15100 && freq <= 15800) return "19m";
  if (freq >= 17480 && freq <= 17900) return "16m";
  if (freq >= 18900 && freq <= 19020) return "15m";
  if (freq >= 21500 && freq <= 21850) return "13m";
  return "31m";
}

/**
 * 格式化频率显示
 */
export function formatFrequency(khz: number): string {
  return `${khz.toLocaleString()} kHz`;
}
