import { useEffect, useState } from "react";
import {
  subscribeFavorites,
  isFavorite as checkFavorite,
  toggleFavorite as doToggle,
  addFavorite,
  removeFavorite,
  getFavorites,
  getFavoritesCount,
} from "@/lib/favorites";

export function useFavorites(): {
  favorites: string[];
  count: number;
} {
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());

  useEffect(() => {
    return subscribeFavorites((ids) => {
      setFavorites([...ids]);
    });
  }, []);

  return {
    favorites,
    count: favorites.length,
  };
}

export function useFavorite(id: string): {
  isFav: boolean;
  toggle: () => boolean;
  add: () => void;
  remove: () => void;
} {
  const [isFav, setIsFav] = useState<boolean>(() => checkFavorite(id));

  useEffect(() => {
    setIsFav(checkFavorite(id));
    return subscribeFavorites(() => {
      setIsFav(checkFavorite(id));
    });
  }, [id]);

  const toggle = () => {
    const result = doToggle(id);
    return result;
  };

  const add = () => addFavorite(id);
  const remove = () => removeFavorite(id);

  return { isFav, toggle, add, remove };
}

export function useFavoritesCount(): number {
  const [count, setCount] = useState<number>(() => getFavoritesCount());

  useEffect(() => {
    return subscribeFavorites((ids) => {
      setCount(ids.length);
    });
  }, []);

  return count;
}
