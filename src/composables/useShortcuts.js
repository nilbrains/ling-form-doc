import { useMagicKeys, whenever } from "@vueuse/core";
import { useComponentsStore } from "@/store/comps";
import { useConfigStore } from "@/store/config";
import { usePersistence } from "./usePersistence";

/**
 * Ctrl + ↑ / ↓ 在设计态上移或下移当前选中的组件
 * @param {() => object} getActiveComp 取当前选中组件的配置
 */
export function useShortcuts({ getActiveComp }) {
  const componentStore = useComponentsStore();
  const configStore = useConfigStore();
  const { persist } = usePersistence();
  const keys = useMagicKeys();

  function moveSelected(up) {
    if (!configStore.config.design) return;
    const active = getActiveComp();
    if (!active?.id) return;
    componentStore.swapItem(componentStore.findIndex(active.id), up);
    persist();
  }

  whenever(keys.control_arrowup, () => moveSelected(true));
  whenever(keys.control_arrowdown, () => moveSelected(false));
}
