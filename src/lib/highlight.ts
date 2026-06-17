/**
 * 高亮文本片段类型
 */
export interface HighlightSegment {
  text: string;
  isHighlight: boolean;
}

/**
 * 将文本按关键词分割为高亮片段数组
 * 大小写不敏感匹配
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

  if (lastIndex < text.length || segments.length === 0) {
    segments.push({
      text: text.slice(lastIndex),
      isHighlight: false,
    });
  }

  return segments;
}

/**
 * 检查文本是否包含关键词（大小写不敏感）
 * @param text 原始文本
 * @param keyword 搜索关键词
 * @returns 是否包含
 */
export function containsKeyword(text: string, keyword: string): boolean {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return false;
  return text.toLowerCase().includes(trimmedKeyword.toLowerCase());
}

/**
 * 检查台站是否在呼号、语言、时段三列中任意一列包含搜索词
 * 大小写不敏感精确包含匹配
 * @param station 台站数据
 * @param keyword 搜索关键词
 * @returns 是否匹配
 */
export function stationMatchesSearch(
  station: { callSign: string; language: string; timeSlot: string },
  keyword: string
): boolean {
  const trimmedKeyword = keyword.trim();
  if (!trimmedKeyword) return true;

  return (
    containsKeyword(station.callSign, trimmedKeyword) ||
    containsKeyword(station.language, trimmedKeyword) ||
    containsKeyword(station.timeSlot, trimmedKeyword)
  );
}
