const STORAGE_KEY = "radio-station-compare";
const MAX_COMPARE = 3;

type CompareListener = (selectedIds: string[]) => void;

const listeners: Set<CompareListener> = new Set();

function readSelected(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeSelected(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((fn) => fn(ids));
}

export function getSelectedForCompare(): string[] {
  return readSelected();
}

export function isSelectedForCompare(id: string): boolean {
  return readSelected().includes(id);
}

export function getCompareCount(): number {
  return readSelected().length;
}

export function canAddToCompare(): boolean {
  return readSelected().length < MAX_COMPARE;
}

export function addToCompare(id: string): boolean {
  const current = readSelected();
  if (current.includes(id)) return true;
  if (current.length >= MAX_COMPARE) return false;
  writeSelected([...current, id]);
  return true;
}

export function removeFromCompare(id: string): void {
  const current = readSelected();
  writeSelected(current.filter((x) => x !== id));
}

export function toggleCompare(id: string): boolean {
  const current = readSelected();
  if (current.includes(id)) {
    writeSelected(current.filter((x) => x !== id));
    return false;
  } else {
    if (current.length >= MAX_COMPARE) return false;
    writeSelected([...current, id]);
    return true;
  }
}

export function clearCompare(): void {
  writeSelected([]);
}

export function subscribeCompare(listener: CompareListener): () => void {
  listeners.add(listener);
  listener(readSelected());
  return () => {
    listeners.delete(listener);
  };
}
