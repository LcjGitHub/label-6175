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

export function useCompareCount(): number {
  const [count, setCount] = useState<number>(() => getCompareCount());

  useEffect(() => {
    return subscribeCompare((ids) => {
      setCount(ids.length);
    });
  }, []);

  return count;
}
