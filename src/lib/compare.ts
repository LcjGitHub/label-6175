const STORAGE_KEY = "radio-station-compare";
const MAX_COMPARE = 3;

type CompareListener = (selectedIds: string[]) => void;

const listeners: Set<CompareListener> = new Set();

/**
 * 从 localStorage 读取当前选中的对比台站 ID 列表
 * 异常时返回空数组，确保容错
 */
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

/**
 * 将选中的对比台站 ID 列表写入 localStorage，并通知所有订阅者
 */
function writeSelected(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  listeners.forEach((fn) => fn(ids));
}

/**
 * 获取当前已选择的对比台站 ID 列表
 */
export function getSelectedForCompare(): string[] {
  return readSelected();
}

/**
 * 判断某个台站是否已加入对比列表
 */
export function isSelectedForCompare(id: string): boolean {
  return readSelected().includes(id);
}

/**
 * 获取当前已选择对比的台站数量
 */
export function getCompareCount(): number {
  return readSelected().length;
}

/**
 * 判断是否还可以继续添加台站到对比列表（最多 3 个）
 */
export function canAddToCompare(): boolean {
  return readSelected().length < MAX_COMPARE;
}

/**
 * 将台站添加到对比列表
 * 若已存在则直接返回 true；若已满则返回 false
 */
export function addToCompare(id: string): boolean {
  const current = readSelected();
  if (current.includes(id)) return true;
  if (current.length >= MAX_COMPARE) return false;
  writeSelected([...current, id]);
  return true;
}

/**
 * 将台站从对比列表中移除
 */
export function removeFromCompare(id: string): void {
  const current = readSelected();
  writeSelected(current.filter((x) => x !== id));
}

/**
 * 切换台站在对比列表中的选中状态
 * 返回操作后的最终选中状态（true 表示已加入，false 表示已移除或无法添加）
 */
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

/**
 * 清空所有对比选择
 */
export function clearCompare(): void {
  writeSelected([]);
}

/**
 * 订阅对比列表的变化
 * 返回取消订阅函数，组件卸载时调用
 */
export function subscribeCompare(listener: CompareListener): () => void {
  listeners.add(listener);
  listener(readSelected());
  return () => {
    listeners.delete(listener);
  };
}
