/**
 * 浏览历史相关 React Hooks
 * 封装 localStorage 历史存储的订阅与变更操作，
 * 在组件卸载时自动取消订阅，避免内存泄漏。
 */

import { useEffect, useState } from "react";
import {
  subscribeHistory,
  addHistory as doAddHistory,
  removeHistory as doRemoveHistory,
  clearHistory as doClearHistory,
  getHistory,
  getHistoryCount,
} from "@/lib/history";
import type { HistoryItem } from "@/lib/history";

/**
 * 订阅浏览历史，返回完整历史列表、台站 ID 列表及记录总数
 * 历史记录变更时自动触发组件重渲染
 */
export function useHistory(): {
  history: HistoryItem[];
  historyIds: string[];
  count: number;
} {
  const [history, setHistory] = useState<HistoryItem[]>(() => getHistory());

  useEffect(() => {
    return subscribeHistory((items) => {
      setHistory([...items]);
    });
  }, []);

  const historyIds = history.map((item) => item.id);

  return {
    history,
    historyIds,
    count: history.length,
  };
}

/**
 * 返回浏览历史的变更操作（新增、删除、清空）
 * 不订阅历史变化，适合仅需触发写入操作的场景
 */
export function useHistoryActions(): {
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
} {
  const add = (id: string) => doAddHistory(id);
  const remove = (id: string) => doRemoveHistory(id);
  const clear = () => doClearHistory();

  return { add, remove, clear };
}

/**
 * 仅订阅浏览历史记录数量
 * 轻量级 Hook，适合头部徽标、计数显示等仅需数字的场景
 */
export function useHistoryCount(): number {
  const [count, setCount] = useState<number>(() => getHistoryCount());

  useEffect(() => {
    return subscribeHistory((items) => {
      setCount(items.length);
    });
  }, []);

  return count;
}
