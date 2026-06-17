import stationsData from "@/mock/stations.json";
import type { Station } from "@/types/station";

/** Mock 台站列表 */
export const stations: Station[] = stationsData as Station[];

/**
 * 根据 ID 查找台站
 */
export function getStationById(id: string): Station | undefined {
  return stations.find((s) => s.id === id);
}
