import { describe, it, expect } from "vitest";
import {
  computeBandStats,
  extractLanguageOptions,
} from "@/lib/band-stats";
import type { Station } from "@/types/station";

const createStation = (id: string, band: Station["band"], language: string): Station => ({
  id,
  callSign: `Station ${id}`,
  frequency: 6000,
  language,
  timeSlot: "00:00-12:00 UTC",
  band,
  listeningAdvice: "测试建议",
});

describe("computeBandStats", () => {
  it("正常数据：按频段聚合台站总数和语言分布正确排序", () => {
    const stations: Station[] = [
      createStation("1", "49m", "英语"),
      createStation("2", "49m", "英语"),
      createStation("3", "49m", "汉语"),
      createStation("4", "31m", "英语"),
      createStation("5", "31m", "法语"),
      createStation("6", "31m", "法语"),
      createStation("7", "31m", "法语"),
    ];

    const result = computeBandStats(stations);

    const band49m = result.find((b) => b.band === "49m")!;
    expect(band49m.total).toBe(3);
    expect(band49m.languages).toHaveLength(2);
    expect(band49m.languages[0]).toEqual({ language: "英语", count: 2 });
    expect(band49m.languages[1]).toEqual({ language: "汉语", count: 1 });

    const band31m = result.find((b) => b.band === "31m")!;
    expect(band31m.total).toBe(4);
    expect(band31m.languages).toHaveLength(2);
    expect(band31m.languages[0]).toEqual({ language: "法语", count: 3 });
    expect(band31m.languages[1]).toEqual({ language: "英语", count: 1 });
  });

  it("空数据：空数组输入返回所有频段统计，总数为0，语言为空", () => {
    const result = computeBandStats([]);

    expect(result.length).toBe(9);
    result.forEach((stat) => {
      expect(stat.total).toBe(0);
      expect(stat.languages).toEqual([]);
    });
  });

  it("边界输入：所有台站属于同一频段", () => {
    const stations: Station[] = [
      createStation("1", "19m", "英语"),
      createStation("2", "19m", "汉语"),
      createStation("3", "19m", "法语"),
    ];

    const result = computeBandStats(stations);

    const band19m = result.find((b) => b.band === "19m")!;
    expect(band19m.total).toBe(3);
    expect(band19m.languages).toHaveLength(3);

    result
      .filter((b) => b.band !== "19m")
      .forEach((stat) => {
        expect(stat.total).toBe(0);
        expect(stat.languages).toEqual([]);
      });
  });

  it("边界输入：所有台站使用同一语言", () => {
    const stations: Station[] = [
      createStation("1", "49m", "英语"),
      createStation("2", "31m", "英语"),
      createStation("3", "19m", "英语"),
    ];

    const result = computeBandStats(stations);

    ["49m", "31m", "19m"].forEach((band) => {
      const stat = result.find((b) => b.band === band)!;
      expect(stat.total).toBe(1);
      expect(stat.languages).toEqual([{ language: "英语", count: 1 }]);
    });
  });

  it("边界输入：单个台站", () => {
    const stations: Station[] = [createStation("1", "25m", "俄语")];

    const result = computeBandStats(stations);

    const band25m = result.find((b) => b.band === "25m")!;
    expect(band25m.total).toBe(1);
    expect(band25m.languages).toEqual([{ language: "俄语", count: 1 }]);
  });

  it("语言分布按数量降序排列，数量相同保持稳定", () => {
    const stations: Station[] = [
      createStation("1", "49m", "英语"),
      createStation("2", "49m", "汉语"),
      createStation("3", "49m", "法语"),
      createStation("4", "49m", "英语"),
      createStation("5", "49m", "汉语"),
    ];

    const result = computeBandStats(stations);
    const band49m = result.find((b) => b.band === "49m")!;

    expect(band49m.languages[0]).toEqual({ language: "英语", count: 2 });
    expect(band49m.languages[1]).toEqual({ language: "汉语", count: 2 });
    expect(band49m.languages[2]).toEqual({ language: "法语", count: 1 });
  });

  it("返回结果频段顺序与BAND_OPTIONS一致", () => {
    const expectedBands = ["49m", "41m", "31m", "25m", "22m", "19m", "16m", "15m", "13m"];
    const result = computeBandStats([]);
    const resultBands = result.map((b) => b.band);
    expect(resultBands).toEqual(expectedBands);
  });
});

describe("extractLanguageOptions", () => {
  it("正常数据：提取去重且排序的语言选项，首项为全部语言", () => {
    const stations: Station[] = [
      createStation("1", "49m", "英语"),
      createStation("2", "31m", "汉语"),
      createStation("3", "19m", "法语"),
      createStation("4", "25m", "英语"),
      createStation("5", "22m", "阿拉伯语"),
    ];

    const result = extractLanguageOptions(stations);

    expect(result[0]).toEqual({ value: "all", label: "全部语言" });
    expect(result[1]).toEqual({ value: "阿拉伯语", label: "阿拉伯语" });
    expect(result[2]).toEqual({ value: "法语", label: "法语" });
    expect(result[3]).toEqual({ value: "汉语", label: "汉语" });
    expect(result[4]).toEqual({ value: "英语", label: "英语" });
    expect(result).toHaveLength(5);
  });

  it("空数据：空数组输入仅返回全部语言选项", () => {
    const result = extractLanguageOptions([]);

    expect(result).toEqual([{ value: "all", label: "全部语言" }]);
    expect(result).toHaveLength(1);
  });

  it("边界输入：所有台站使用同一语言", () => {
    const stations: Station[] = [
      createStation("1", "49m", "日语"),
      createStation("2", "31m", "日语"),
      createStation("3", "19m", "日语"),
    ];

    const result = extractLanguageOptions(stations);

    expect(result).toEqual([
      { value: "all", label: "全部语言" },
      { value: "日语", label: "日语" },
    ]);
    expect(result).toHaveLength(2);
  });

  it("边界输入：语言已按字母顺序排列的验证", () => {
    const stations: Station[] = [
      createStation("1", "49m", "俄语"),
      createStation("2", "31m", "阿拉伯语"),
      createStation("3", "19m", "韩语"),
    ];

    const result = extractLanguageOptions(stations);
    const languages = result.slice(1).map((o) => o.value);

    expect(languages).toEqual(["阿拉伯语", "俄语", "韩语"]);
  });

  it("边界输入：单个台站", () => {
    const stations: Station[] = [createStation("1", "49m", "西班牙语")];

    const result = extractLanguageOptions(stations);

    expect(result).toEqual([
      { value: "all", label: "全部语言" },
      { value: "西班牙语", label: "西班牙语" },
    ]);
  });
});
