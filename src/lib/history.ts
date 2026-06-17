/**
 * 浏览历史本地存储模块
 *
 * 基于 localStorage 持久化用户最近访问的台站记录，最多保留 10 条；
 * 记录按访问时间倒序排列，同一台站重复访问时自动置顶并去重；
 * 提供订阅机制，支持 React Hook 等消费方实时响应历史变更。
 *
 * 内部通过通用本地存储工厂实现，统一管理键名前缀、异常容错与订阅通知。
 */

import { createLocalStorageStore } from "./local-storage";

/** 最大历史记录条数 */
const MAX_HISTORY = 10;

/** 浏览历史单项结构：台站 ID + 访问时间戳 */
export interface HistoryItem {
  id: string;
  timestamp: number;
}

/** 历史记录变更监听器类型 */
type HistoryListener = (history: HistoryItem[]) => void;

/**
 * 浏览历史存储实例
 * 读取时自动校验数据格式、按时间倒序排序并截断到最大条数
 */
const historyStore = createLocalStorageStore<HistoryItem[]>({
  key: "history",
  defaultValue: [],
  validate: (data) => {
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (x) => x && typeof x.id === "string" && typeof x.timestamp === "number",
      )
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_HISTORY);
  },
});

/**
 * 写入历史记录（内部函数）
 * 写入前自动截断到最大条数
 */
function writeHistory(items: HistoryItem[]): void {
  const trimmed = items.slice(0, MAX_HISTORY);
  historyStore.set(trimmed);
}

/** 获取当前浏览历史列表（按时间倒序，最多 10 条） */
export function getHistory(): HistoryItem[] {
  return historyStore.get();
}

/** 获取当前浏览历史的台站 ID 列表（按时间倒序） */
export function getHistoryIds(): string[] {
  return historyStore.get().map((item) => item.id);
}

/**
 * 新增一条浏览历史
 *
 * 若该台站已存在，则先移除旧记录再将新记录置顶，
 * 保证去重并反映最新访问时间。
 *
 * @param id 台站 ID
 */
export function addHistory(id: string): void {
  const current = historyStore.get();
  const filtered = current.filter((item) => item.id !== id);
  const updated = [{ id, timestamp: Date.now() }, ...filtered];
  writeHistory(updated);
}

/**
 * 按台站 ID 移除指定浏览历史记录
 *
 * @param id 台站 ID
 */
export function removeHistory(id: string): void {
  const current = historyStore.get();
  writeHistory(current.filter((item) => item.id !== id));
}

/** 清空全部浏览历史 */
export function clearHistory(): void {
  writeHistory([]);
}

/** 获取当前浏览历史记录条数 */
export function getHistoryCount(): number {
  return historyStore.get().length;
}

/**
 * 订阅浏览历史变更
 *
 * 订阅时立即推送一次当前状态；返回取消订阅函数，
 * 组件卸载时应调用以避免内存泄漏。
 *
 * @param listener 变更监听器
 * @returns 取消订阅函数
 */
export function subscribeHistory(listener: HistoryListener): () => void {
  return historyStore.subscribe(listener);
}
