/**
 * 台站对比本地存储模块
 *
 * 基于 localStorage 持久化用户选择的对比台站 ID 列表，最多支持 3 个台站同时对比；
 * 提供订阅机制，支持 React Hook 等消费方实时响应对比列表变更。
 *
 * 内部通过通用本地存储工厂实现，统一管理键名前缀、异常容错与订阅通知。
 */

import { createLocalStorageStore } from "./local-storage";

/** 最大对比台站数量 */
const MAX_COMPARE = 3;

/** 对比列表变更监听器类型 */
type CompareListener = (selectedIds: string[]) => void;

/**
 * 对比台站存储实例
 * 存储数据为台站 ID 字符串数组，读取时自动过滤非字符串项以保证类型安全
 */
const compareStore = createLocalStorageStore<string[]>({
  key: "compare",
  defaultValue: [],
  validate: (data) =>
    Array.isArray(data) ? data.filter((x) => typeof x === "string") : [],
});

/** 获取当前已选择的对比台站 ID 列表 */
export function getSelectedForCompare(): string[] {
  return compareStore.get();
}

/**
 * 判断某个台站是否已加入对比列表
 *
 * @param id 台站 ID
 * @returns 是否已加入对比
 */
export function isSelectedForCompare(id: string): boolean {
  return compareStore.get().includes(id);
}

/** 获取当前已选择对比的台站数量 */
export function getCompareCount(): number {
  return compareStore.get().length;
}

/**
 * 判断是否还可以继续添加台站到对比列表（最多 3 个）
 *
 * @returns 是否可以添加
 */
export function canAddToCompare(): boolean {
  return compareStore.get().length < MAX_COMPARE;
}

/**
 * 将台站添加到对比列表
 *
 * 若已存在则直接返回 true；若已满则返回 false。
 *
 * @param id 台站 ID
 * @returns 是否成功加入对比列表
 */
export function addToCompare(id: string): boolean {
  const current = compareStore.get();
  if (current.includes(id)) return true;
  if (current.length >= MAX_COMPARE) return false;
  compareStore.set([...current, id]);
  return true;
}

/**
 * 将台站从对比列表中移除
 *
 * @param id 台站 ID
 */
export function removeFromCompare(id: string): void {
  const current = compareStore.get();
  compareStore.set(current.filter((x) => x !== id));
}

/**
 * 切换台站在对比列表中的选中状态
 *
 * 返回操作后的最终选中状态（true 表示已加入，false 表示已移除或无法添加）。
 *
 * @param id 台站 ID
 * @returns 操作后的最终选中状态
 */
export function toggleCompare(id: string): boolean {
  const current = compareStore.get();
  if (current.includes(id)) {
    compareStore.set(current.filter((x) => x !== id));
    return false;
  } else {
    if (current.length >= MAX_COMPARE) return false;
    compareStore.set([...current, id]);
    return true;
  }
}

/** 清空所有对比选择 */
export function clearCompare(): void {
  compareStore.set([]);
}

/**
 * 订阅对比列表的变化
 *
 * 订阅时立即推送一次当前状态；返回取消订阅函数，
 * 组件卸载时应调用以避免内存泄漏。
 *
 * @param listener 变更监听器
 * @returns 取消订阅函数
 */
export function subscribeCompare(listener: CompareListener): () => void {
  return compareStore.subscribe(listener);
}
