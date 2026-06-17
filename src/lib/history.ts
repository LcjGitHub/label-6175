const STORAGE_KEY = "radio-station-history";
const MAX_HISTORY = 10;

export interface HistoryItem {
  id: string;
  timestamp: number;
}

type HistoryListener = (history: HistoryItem[]) => void;

const listeners: Set<HistoryListener> = new Set();

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

function writeHistory(items: HistoryItem[]) {
  const trimmed = items.slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  listeners.forEach((fn) => fn(trimmed));
}

export function getHistory(): HistoryItem[] {
  return readHistory();
}

export function getHistoryIds(): string[] {
  return readHistory().map((item) => item.id);
}

export function addHistory(id: string): void {
  const current = readHistory();
  const filtered = current.filter((item) => item.id !== id);
  const updated = [{ id, timestamp: Date.now() }, ...filtered];
  writeHistory(updated);
}

export function removeHistory(id: string): void {
  const current = readHistory();
  writeHistory(current.filter((item) => item.id !== id));
}

export function clearHistory(): void {
  writeHistory([]);
}

export function getHistoryCount(): number {
  return readHistory().length;
}

export function subscribeHistory(listener: HistoryListener): () => void {
  listeners.add(listener);
  listener(readHistory());
  return () => {
    listeners.delete(listener);
  };
}
