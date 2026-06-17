import { useEffect, useState } from "react";
import {
  subscribeCompare,
  isSelectedForCompare as checkSelected,
  toggleCompare as doToggle,
  addToCompare,
  removeFromCompare,
  getSelectedForCompare,
  getCompareCount,
  clearCompare,
} from "@/lib/compare";

/**
 * 获取全局对比选择状态
 * 返回已选 ID 列表、数量、是否还可添加，以及清空操作方法
 * 通过订阅机制跨组件同步状态
 */
export function useCompare(): {
  selectedIds: string[];
  count: number;
  canAdd: boolean;
  clear: () => void;
} {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => getSelectedForCompare());

  useEffect(() => {
    return subscribeCompare((ids) => {
      setSelectedIds([...ids]);
    });
  }, []);

  return {
    selectedIds,
    count: selectedIds.length,
    canAdd: selectedIds.length < 3,
    clear: clearCompare,
  };
}

/**
 * 获取单个台站的对比选择状态
 * 用于表格每行的复选框渲染
 * 返回当前选中状态及切换、添加、移除操作方法
 */
export function useCompareItem(id: string): {
  isSelected: boolean;
  toggle: () => boolean;
  add: () => boolean;
  remove: () => void;
} {
  const [isSelected, setIsSelected] = useState<boolean>(() => checkSelected(id));

  useEffect(() => {
    setIsSelected(checkSelected(id));
    return subscribeCompare(() => {
      setIsSelected(checkSelected(id));
    });
  }, [id]);

  const toggle = () => {
    return doToggle(id);
  };

  const add = () => addToCompare(id);
  const remove = () => removeFromCompare(id);

  return { isSelected, toggle, add, remove };
}

/**
 * 仅获取当前已选择对比的台站数量
 * 适合顶部导航等只需计数的轻量化场景
 */
export function useCompareCount(): number {
  const [count, setCount] = useState<number>(() => getCompareCount());

  useEffect(() => {
    return subscribeCompare((ids) => {
      setCount(ids.length);
    });
  }, []);

  return count;
}
