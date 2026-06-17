/**
 * 浏览历史本地存储模块
 * 基于 localStorage 持久化用户最近访问的台站记录，最多保留 10 条；
 * 记录按访问时间倒序排列，同一台站重复访问时自动置顶并去重；
 * 提供订阅机制，支持 React Hook 等消费方实时响应历史变更。
 */

const STORAGE_KEY = "radio-station-history";
const MAX_HISTORY = 10;

/** 浏览历史单项结构：台站 ID + 访问时间戳 */
export interface HistoryItem {
  id: string;
  timestamp: number;
}

/** 历史记录变更监听器类型 */
type HistoryListener = (history: HistoryItem[]) => void;

const listeners: Set<HistoryListener> = new Set();

/** 从 localStorage 读取并规范化历史记录，返回按时间倒序的最多 MAX_HISTORY 条 */
function readHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x.id === "string" && typeof x.timestamp === "number")
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

/** 将历史记录写入 localStorage，并通知所有订阅者 */
function writeHistory(items: HistoryItem[]) {
  const trimmed = items.slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  listeners.forEach((fn) => fn(trimmed));
}

/** 获取当前浏览历史列表（按时间倒序，最多 10 条） */
export function getHistory(): HistoryItem[] {
  return readHistory();
}

/** 获取当前浏览历史的台站 ID 列表（按时间倒序） */
export function getHistoryIds(): string[] {
  return readHistory().map((item) => item.id);
}

/**
 * 新增一条浏览历史
 * 若该台站已存在，则先移除旧记录再将新记录置顶，保证去重并反映最新访问时间
 */
export function addHistory(id: string): void {
  const current = readHistory();
  const filtered = current.filter((item) => item.id !== id);
  const updated = [{ id, timestamp: Date.now() }, ...filtered];
  writeHistory(updated);
}

/** 按台站 ID 移除指定浏览历史记录 */
export function removeHistory(id: string): void {
  const current = readHistory();
  writeHistory(current.filter((item) => item.id !== id));
}

/** 清空全部浏览历史 */
export function clearHistory(): void {
  writeHistory([]);
}

/** 获取当前浏览历史记录条数 */
export function getHistoryCount(): number {
  return readHistory().length;
}

/**
 * 订阅浏览历史变更
 * 订阅时立即推送一次当前状态；返回取消订阅函数，组件卸载时应调用以避免内存泄漏
 */
export function subscribeHistory(listener: HistoryListener): () => void {
  listeners.add(listener);
  listener(readHistory());
  return () => {
    listeners.delete(listener);
  };
}
