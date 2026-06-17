import stationsData from "@/mock/stations.json";
import type { Station, FrequencyBand } from "@/types/station";

/** Mock 台站列表 */
export const stations: Station[] = stationsData as Station[];

/**
 * 根据 ID 查找台站
 */
export function getStationById(id: string): Station | undefined {
  return stations.find((s) => s.id === id);
}

/**
 * 根据频段查找台站，排除指定 ID
 */
export function getStationsByBand(band: FrequencyBand, excludeId?: string): Station[] {
  return stations
    .filter((s) => s.band === band && s.id !== excludeId)
    .sort((a, b) => a.frequency - b.frequency);
}

/**
 * 获取同频段其他台站（最多 limit 条）
 */
export function getSameBandStations(stationId: string, limit: number = 5): Station[] {
  const station = getStationById(stationId);
  if (!station) return [];
  return getStationsByBand(station.band, stationId).slice(0, limit);
}
