/**
 * 收藏台站本地存储模块
 *
 * 基于 localStorage 持久化用户收藏的台站 ID 列表，
 * 提供订阅机制，支持 React Hook 等消费方实时响应收藏变更。
 *
 * 内部通过通用本地存储工厂实现，统一管理键名前缀、异常容错与订阅通知。
 */

import { createLocalStorageStore } from "./local-storage";

/** 收藏变更监听器类型 */
type FavoritesListener = (favorites: string[]) => void;

/**
 * 收藏存储实例
 * 存储数据为台站 ID 字符串数组，读取时自动过滤非字符串项以保证类型安全
 */
const favoritesStore = createLocalStorageStore<string[]>({
  key: "favorites",
  defaultValue: [],
  validate: (data) =>
    Array.isArray(data) ? data.filter((x) => typeof x === "string") : [],
});

/** 获取当前收藏的台站 ID 列表 */
export function getFavorites(): string[] {
  return favoritesStore.get();
}

/**
 * 判断指定台站是否已收藏
 *
 * @param id 台站 ID
 * @returns 是否已收藏
 */
export function isFavorite(id: string): boolean {
  return favoritesStore.get().includes(id);
}

/**
 * 添加台站到收藏列表
 * 若已存在则不重复添加
 *
 * @param id 台站 ID
 */
export function addFavorite(id: string): void {
  const current = favoritesStore.get();
  if (!current.includes(id)) {
    favoritesStore.set([...current, id]);
  }
}

/**
 * 从收藏列表移除指定台站
 *
 * @param id 台站 ID
 */
export function removeFavorite(id: string): void {
  const current = favoritesStore.get();
  favoritesStore.set(current.filter((x) => x !== id));
}

/**
 * 切换台站的收藏状态
 *
 * @param id 台站 ID
 * @returns 操作后的最终收藏状态（true 表示已收藏，false 表示已取消）
 */
export function toggleFavorite(id: string): boolean {
  const current = favoritesStore.get();
  if (current.includes(id)) {
    favoritesStore.set(current.filter((x) => x !== id));
    return false;
  } else {
    favoritesStore.set([...current, id]);
    return true;
  }
}

/** 获取当前收藏的台站数量 */
export function getFavoritesCount(): number {
  return favoritesStore.get().length;
}

/**
 * 订阅收藏列表变更
 *
 * 订阅时立即推送一次当前状态；返回取消订阅函数，
 * 组件卸载时应调用以避免内存泄漏。
 *
 * @param listener 变更监听器
 * @returns 取消订阅函数
 */
export function subscribeFavorites(listener: FavoritesListener): () => void {
  return favoritesStore.subscribe(listener);
}
