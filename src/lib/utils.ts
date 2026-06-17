import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind 类名，避免冲突。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 高亮文本片段类型
 */
export interface HighlightSegment {
  text: string;
  isHighlight: boolean;
}

/**
 * 将文本按关键词分割为高亮片段数组
 * @param text 原始文本
 * @param keyword 搜索关键词
 * @returns 高亮片段数组，空关键词时返回单片段
 */
export function getHighlightSegments(text: string, keyword: string): HighlightSegment[] {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) {
    return [{ text, isHighlight: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerKeyword = trimmedKeyword.toLowerCase();
  const segments: HighlightSegment[] = [];
  let lastIndex = 0;
  let index = lowerText.indexOf(lowerKeyword);

  while (index !== -1) {
    if (index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, index),
        isHighlight: false,
      });
    }
    segments.push({
      text: text.slice(index, index + lowerKeyword.length),
      isHighlight: true,
    });
    lastIndex = index + lowerKeyword.length;
    index = lowerText.indexOf(lowerKeyword, lastIndex);
  }

  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isHighlight: false,
    });
  }

  return segments;
}
