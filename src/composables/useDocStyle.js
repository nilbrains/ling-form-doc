import { useComponentsStore } from "@/store/comps";

const STYLE_ID = "ling-doc-style";

// 把各组件的自定义 css 汇总后注入到 head 中的单个 style 标签
export function useDocStyle() {
  const componentStore = useComponentsStore();

  function genStyle() {
    let el = document.querySelector(`style#${STYLE_ID}`);
    if (!el) {
      el = document.createElement("style");
      el.setAttribute("id", STYLE_ID);
      document.head.appendChild(el);
    }
    el.innerHTML = componentStore.genStyle();
  }

  return { genStyle };
}
