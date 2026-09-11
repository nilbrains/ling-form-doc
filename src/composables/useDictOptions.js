import { api } from "@/utils/api";
import { useComponentsStore } from "@/store/comps";
import { useConfigStore } from "@/store/config";

// 填写态下预加载选择类组件的远程字典选项
export function useDictOptions() {
  const componentStore = useComponentsStore();
  const configStore = useConfigStore();

  function genSelectOptions() {
    if (configStore.config.design) return;
    // 宿主未配置字典接口时不发请求，避免误请求当前页面地址
    if (!window.config?.dictAllUrl) return;
    const targets = componentStore.components.filter(
      (op) => ["SELECT", "RADIO", "CHECK"].includes(op.type) && "1" !== op.unAutoLoad,
    );
    api
      .Post(window.config.dictAllUrl, targets)
      .send()
      .then((res) => {
        componentStore.options = res.data?.data || {};
      })
      .catch((e) => {
        console.error(`[ling-doc] 加载字典失败: ${e}`);
      });
  }

  return { genSelectOptions };
}
