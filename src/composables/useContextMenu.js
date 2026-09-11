import { ref } from "vue";
import { COMP_FUN_MAP, WIDTH_PRESETS } from "@/components/comp";
import { useComponentsStore } from "@/store/comps";
import { useConfigStore } from "@/store/config";
import { usePersistence } from "./usePersistence";

const RIGHT_MENU = {
  START: [
    { key: "ADD_COMPONENTS", name: "添加组件" },
    { key: "COPY_COMPONENT", name: "复制组件" },
    { key: "CHANGE_WIDTH", name: "组件布局" },
  ],
  ADD_COMPONENTS: [
    { key: "ADD_TEXT", name: "文本" },
    { key: "ADD_INPUT", name: "输入框" },
    { key: "ADD_SELECT", name: "选择框" },
    { key: "ADD_CHECK", name: "多选框" },
    { key: "ADD_RADIO", name: "单选框" },
    { key: "ADD_AREA", name: "地址选择" },
    { key: "START", name: "返回主菜单" },
  ],
  // 布局选项与执行逻辑共用 WIDTH_PRESETS 一份数据
  CHANGE_WIDTH: [
    ...Object.entries(WIDTH_PRESETS).map(([key, { name }]) => ({ key, name })),
    { key: "START", name: "返回主菜单" },
  ],
};

/**
 * 设计态的右键菜单
 * @param {() => object} getActiveComp 取当前选中组件的配置
 */
export function useContextMenu({ getActiveComp }) {
  const componentStore = useComponentsStore();
  const configStore = useConfigStore();
  const { persist } = usePersistence();

  const nowMenu = ref("START");
  const position = ref({ top: 0, left: 0, bottom: 0, right: 0 });
  const dropdownRef = ref(null);
  const triggerRef = ref({ getBoundingClientRect: () => position.value });

  function openMenu(event) {
    // 填写态交给浏览器原生菜单
    if (!configStore.config.design) return;
    const { clientX, clientY } = event;
    position.value = DOMRect.fromRect({ x: clientX, y: clientY });
    event.preventDefault();
    dropdownRef.value?.handleOpen(event.target);
  }

  function handleCommand(cmd) {
    if (!configStore.config.design) return;
    // 有下级菜单时先展开，不执行动作
    if (cmd in RIGHT_MENU) {
      nowMenu.value = cmd;
      dropdownRef.value?.handleOpen();
      return;
    }
    if (cmd in COMP_FUN_MAP) {
      COMP_FUN_MAP[cmd](
        componentStore,
        () => {
          persist();
          nowMenu.value = "START";
        },
        getActiveComp(),
      );
    }
  }

  return { RIGHT_MENU, nowMenu, position, dropdownRef, triggerRef, openMenu, handleCommand };
}
