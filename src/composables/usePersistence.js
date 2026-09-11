import { useComponentsStore } from "@/store/comps";
import { useConfigStore } from "@/store/config";

// 设计态的模板保存在浏览器本地，填写态的数据由宿主自行负责
const STORAGE_KEY = "ling-comps";

export function usePersistence() {
  const componentStore = useComponentsStore();
  const configStore = useConfigStore();

  function persist() {
    if (!configStore.config.design) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(componentStore.components));
  }

  // 读取本地模板，数据损坏时按空文档处理
  function readStored() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (error) {
      console.error(`[ling-doc] 本地模板解析失败，已忽略: ${error}`);
      return [];
    }
  }

  return { persist, readStored };
}
