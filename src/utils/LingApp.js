import { useComponentsStore } from "@/store/comps";
import { useConfigStore } from "@/store/config";
import { onMounted, nextTick } from "vue";

export function useLingApp(onInitFun = () => {}) {
  const configStore = useConfigStore();
  const componentStore = useComponentsStore();
  const LingApp = {
    // 初始化配置
    init: (option) => {
      return new Promise((resolve, reject) => {
        try {
          console.log("[lingapp] option === > " + JSON.stringify(option));
          configStore.fillConfig(option);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    loadComponents: (components) => {
      componentStore.fill(components, () => {
        onInitFun && onInitFun();
      });
    },
    saveComponents: () => {
      return componentStore.components;
    },
    loadData: (datas) => {
      const __ = componentStore.components;
      __.forEach((it) => {
        it.value = datas[it];
        if (
          (it.type == "RADIO" || it.type == "CHECK") &&
          it.optionCheck != ""
        ) {
          const _ = it.optionCheck.split(/\n/).filter((iti) => (iti.indexOf("@") > 0));
          const inputs = _.map((it) => {
            const __ = it.split(":");
            const [, , name, , ] = (
              (__[1] || __[0]).trim() ?? ""
            ).split("@");
            return name;
          });
          if (inputs.length > 0) {
            inputs.forEach(cc => {
              componentStore.setSubValue(it.label, cc, datas[cc] || "");
            })
          }
        }
      });
    },
    clearData: () => {
      componentStore.clearValue();
    },
    saveData: () => {
      const ___ = {};
      const __ = componentStore.components;
      __.forEach((it) => {
        ___[`${(it?.label ?? "") == "" ? it?.id : it?.label}`] = it.value;
        if (it?.childrens) {
          Object.keys(it?.childrens || []).forEach((ti) => {
            ___[`${ti}`] = it?.childrens[ti] || "";
          });
        }
      });
      return ___;
    },
    msg: ElMessage,
  };

  onMounted(() => {
    window.LingApp = LingApp;
  });
  return { LingApp };
}
