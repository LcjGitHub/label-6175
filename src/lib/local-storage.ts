/**
 * 本地存储状态管理工厂
 *
 * 提供基于 localStorage 的响应式状态管理能力，统一处理：
 * - 键名前缀管理
 * - JSON 序列化/反序列化
 * - 异常容错（读取失败时返回默认值）
 * - 类型校验与数据规范化
 * - 订阅/通知机制
 *
 * 通过工厂函数创建各类业务存储模块，保持接口一致性。
 */

/** localStorage 键名前缀，统一管理项目内所有存储键 */
const STORAGE_KEY_PREFIX = "radio-station-";

/** 存储变更监听器类型 */
export type StorageListener<T> = (value: T) => void;

/**
 * 本地存储 Store 接口
 *
 * @template T 存储的数据类型
 */
export interface LocalStorageStore<T> {
  /** 完整的 localStorage 键名 */
  readonly key: string;
  /** 读取当前存储值 */
  get: () => T;
  /** 设置新值并通知所有订阅者 */
  set: (value: T) => void;
  /**
   * 订阅存储变更
   * 订阅时立即推送一次当前值；返回取消订阅函数
   */
  subscribe: (listener: StorageListener<T>) => () => void;
}

/**
 * 工厂函数配置项
 *
 * @template T 存储的数据类型
 */
export interface CreateStorageStoreOptions<T> {
  /** 存储键名（不含前缀） */
  key: string;
  /** 默认值，读取失败或无数据时返回 */
  defaultValue: T;
  /**
   * 数据校验与规范化函数
   * 从 localStorage 读取原始数据后调用，确保数据类型正确
   * @param data 从 localStorage 解析出的原始数据
   * @returns 校验并规范化后的数据
   */
  validate: (data: unknown) => T;
  /** 自定义键名前缀，默认使用 STORAGE_KEY_PREFIX */
  prefix?: string;
}

/**
 * 创建本地存储状态管理实例
 *
 * @template T 存储的数据类型
 * @param options 配置项
 * @returns 存储 Store 实例
 *
 * @example
 * ```ts
 * const favoritesStore = createLocalStorageStore<string[]>({
 *   key: "favorites",
 *   defaultValue: [],
 *   validate: (data) =>
 *     Array.isArray(data) ? data.filter((x) => typeof x === "string") : [],
 * });
 * ```
 */
export function createLocalStorageStore<T>(
  options: CreateStorageStoreOptions<T>,
): LocalStorageStore<T> {
  const {
    key,
    defaultValue,
    validate,
    prefix = STORAGE_KEY_PREFIX,
  } = options;

  const fullKey = `${prefix}${key}`;
  const listeners = new Set<StorageListener<T>>();

  /**
   * 从 localStorage 读取并校验数据
   * 异常时返回默认值
   */
  function read(): T {
    try {
      const raw = localStorage.getItem(fullKey);
      if (raw === null) return defaultValue;
      const parsed = JSON.parse(raw);
      return validate(parsed);
    } catch {
      return defaultValue;
    }
  }

  /**
   * 将数据写入 localStorage 并通知所有订阅者
   */
  function write(value: T): void {
    localStorage.setItem(fullKey, JSON.stringify(value));
    listeners.forEach((fn) => fn(value));
  }

  /**
   * 订阅数据变更
   * 订阅时立即推送一次当前值
   * 返回取消订阅函数
   */
  function subscribe(listener: StorageListener<T>): () => void {
    listeners.add(listener);
    listener(read());
    return () => {
      listeners.delete(listener);
    };
  }

  return {
    get key() {
      return fullKey;
    },
    get: read,
    set: write,
    subscribe,
  };
}
