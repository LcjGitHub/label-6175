import { describe, it, expect } from "vitest";
import { getHighlightSegments, containsKeyword } from "@/lib/highlight";

describe("getHighlightSegments", () => {
  it("正常数据：文本包含单个关键词，正确分割为高亮片段", () => {
    const result = getHighlightSegments("Hello World", "World");

    expect(result).toEqual([
      { text: "Hello ", isHighlight: false },
      { text: "World", isHighlight: true },
    ]);
  });

  it("正常数据：文本包含多个关键词，正确分割所有匹配", () => {
    const result = getHighlightSegments("test abc test xyz test", "test");

    expect(result).toEqual([
      { text: "test", isHighlight: true },
      { text: " abc ", isHighlight: false },
      { text: "test", isHighlight: true },
      { text: " xyz ", isHighlight: false },
      { text: "test", isHighlight: true },
    ]);
  });

  it("正常数据：关键词在文本中间", () => {
    const result = getHighlightSegments("前缀匹配关键词后缀", "匹配");

    expect(result).toEqual([
      { text: "前缀", isHighlight: false },
      { text: "匹配", isHighlight: true },
      { text: "关键词后缀", isHighlight: false },
    ]);
  });

  it("空数据：关键词为空字符串，返回单片段无高亮", () => {
    const result = getHighlightSegments("Hello World", "");

    expect(result).toEqual([{ text: "Hello World", isHighlight: false }]);
  });

  it("空数据：关键词为空白字符，返回单片段无高亮", () => {
    const result = getHighlightSegments("Hello World", "   ");

    expect(result).toEqual([{ text: "Hello World", isHighlight: false }]);
  });

  it("空数据：文本为空字符串，关键词为空", () => {
    const result = getHighlightSegments("", "");

    expect(result).toEqual([{ text: "", isHighlight: false }]);
  });

  it("空数据：文本为空字符串，有关键词", () => {
    const result = getHighlightSegments("", "test");

    expect(result).toEqual([{ text: "", isHighlight: false }]);
  });

  it("边界输入：大小写不敏感匹配，关键词小写匹配大写", () => {
    const result = getHighlightSegments("HELLO WORLD", "hello");

    expect(result).toEqual([
      { text: "HELLO", isHighlight: true },
      { text: " WORLD", isHighlight: false },
    ]);
  });

  it("边界输入：大小写不敏感匹配，关键词大写匹配小写", () => {
    const result = getHighlightSegments("hello world", "HELLO");

    expect(result).toEqual([
      { text: "hello", isHighlight: true },
      { text: " world", isHighlight: false },
    ]);
  });

  it("边界输入：大小写不敏感混合匹配", () => {
    const result = getHighlightSegments("Hello World hello", "HELLO");

    expect(result).toEqual([
      { text: "Hello", isHighlight: true },
      { text: " World ", isHighlight: false },
      { text: "hello", isHighlight: true },
    ]);
  });

  it("边界输入：关键词与文本完全相同", () => {
    const result = getHighlightSegments("test", "test");

    expect(result).toEqual([{ text: "test", isHighlight: true }]);
  });

  it("边界输入：关键词比文本长，无匹配", () => {
    const result = getHighlightSegments("test", "testing");

    expect(result).toEqual([{ text: "test", isHighlight: false }]);
  });

  it("边界输入：关键词出现在开头和结尾", () => {
    const result = getHighlightSegments("test hello test", "test");

    expect(result).toEqual([
      { text: "test", isHighlight: true },
      { text: " hello ", isHighlight: false },
      { text: "test", isHighlight: true },
    ]);
  });

  it("边界输入：连续出现关键词", () => {
    const result = getHighlightSegments("testtesttest", "test");

    expect(result).toEqual([
      { text: "test", isHighlight: true },
      { text: "test", isHighlight: true },
      { text: "test", isHighlight: true },
    ]);
  });

  it("边界输入：中文文本中文关键词", () => {
    const result = getHighlightSegments("中国人民广播电台", "广播");

    expect(result).toEqual([
      { text: "中国人民", isHighlight: false },
      { text: "广播", isHighlight: true },
      { text: "电台", isHighlight: false },
    ]);
  });

  it("边界输入：关键词包含特殊字符", () => {
    const result = getHighlightSegments("test@#$test", "@#$");

    expect(result).toEqual([
      { text: "test", isHighlight: false },
      { text: "@#$", isHighlight: true },
      { text: "test", isHighlight: false },
    ]);
  });
});

describe("containsKeyword", () => {
  it("正常数据：文本包含关键词，返回true", () => {
    expect(containsKeyword("Hello World", "World")).toBe(true);
  });

  it("正常数据：文本不包含关键词，返回false", () => {
    expect(containsKeyword("Hello World", "test")).toBe(false);
  });

  it("空数据：关键词为空字符串，返回false", () => {
    expect(containsKeyword("Hello World", "")).toBe(false);
  });

  it("空数据：关键词为空白字符，返回false", () => {
    expect(containsKeyword("Hello World", "   ")).toBe(false);
  });

  it("空数据：文本为空字符串，返回false", () => {
    expect(containsKeyword("", "test")).toBe(false);
  });

  it("空数据：文本和关键词都为空，返回false", () => {
    expect(containsKeyword("", "")).toBe(false);
  });

  it("边界输入：大小写不敏感，小写匹配大写", () => {
    expect(containsKeyword("HELLO WORLD", "hello")).toBe(true);
  });

  it("边界输入：大小写不敏感，大写匹配小写", () => {
    expect(containsKeyword("hello world", "HELLO")).toBe(true);
  });

  it("边界输入：大小写不敏感混合", () => {
    expect(containsKeyword("HeLLo WoRLd", "hElLo")).toBe(true);
  });

  it("边界输入：文本与关键词完全相同", () => {
    expect(containsKeyword("test", "test")).toBe(true);
  });

  it("边界输入：关键词比文本长", () => {
    expect(containsKeyword("test", "testing")).toBe(false);
  });

  it("边界输入：关键词出现在开头", () => {
    expect(containsKeyword("test hello", "test")).toBe(true);
  });

  it("边界输入：关键词出现在结尾", () => {
    expect(containsKeyword("hello test", "test")).toBe(true);
  });

  it("边界输入：中文匹配", () => {
    expect(containsKeyword("中国人民广播电台", "广播")).toBe(true);
  });

  it("边界输入：关键词包含特殊字符", () => {
    expect(containsKeyword("test@#$test", "@#$")).toBe(true);
  });

  it("边界输入：关键词包含空格", () => {
    expect(containsKeyword("Hello World Test", "World Test")).toBe(true);
  });
});
