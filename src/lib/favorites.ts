const STORAGE_KEY = "radio-station-favorites";

type FavoritesListener = (favorites: string[]) => void;

const listeners: Set<FavoritesListener> = new Set();

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((fn) => fn(ids));
}

export function getFavorites(): string[] {
  return readFavorites();
}

export function isFavorite(id: string): boolean {
  return readFavorites().includes(id);
}

export function addFavorite(id: string): void {
  const current = readFavorites();
  if (!current.includes(id)) {
    writeFavorites([...current, id]);
  }
}

export function removeFavorite(id: string): void {
  const current = readFavorites();
  writeFavorites(current.filter((x) => x !== id));
}

export function toggleFavorite(id: string): boolean {
  const current = readFavorites();
  if (current.includes(id)) {
    writeFavorites(current.filter((x) => x !== id));
    return false;
  } else {
    writeFavorites([...current, id]);
    return true;
  }
}

export function getFavoritesCount(): number {
  return readFavorites().length;
}

export function subscribeFavorites(listener: FavoritesListener): () => void {
  listeners.add(listener);
  listener(readFavorites());
  return () => {
    listeners.delete(listener);
  };
}
