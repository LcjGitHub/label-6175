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

export function useHistoryCount(): number {
  const [count, setCount] = useState<number>(() => getHistoryCount());

  useEffect(() => {
    return subscribeHistory((items) => {
      setCount(items.length);
    });
  }, []);

  return count;
}
