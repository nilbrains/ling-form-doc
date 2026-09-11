import { v4 as uuid } from "uuid";
import { cloneDeep } from "lodash-es";
import { useComponentsStore } from "@/store/comps";
import { usePersistence } from "./usePersistence";

// 自定义监听函数按函数体缓存编译结果，避免每次输入都重新 new Function
const FUN_ARGS = ["value", "subKey", "subValue", "selectValue", "item", "msg", "mods"];
const SUB_FUN_ARGS = ["value", "subKey", "subValue", "item", "msg", "mods"];
const FUN_CACHE_MAX = 50;
const funCache = new Map();

function compileFun(code, argNames) {
  const key = `${argNames.length}|${code}`;
  let compiled = funCache.get(key);
  if (!compiled) {
    compiled = new Function(...argNames, code);
    // 超出上限时丢弃最早一条，避免用户反复修改函数导致缓存无限增长
    if (funCache.size >= FUN_CACHE_MAX) {
      funCache.delete(funCache.keys().next().value);
    }
    funCache.set(key, compiled);
  }
  return compiled;
}

// 尝试执行fun自定义函数
function runFun(code, argNames, args, id) {
  if (!code) return;
  try {
    compileFun(code, argNames)(...args);
  } catch (error) {
    console.error(`[${id}]自定义函数错误: ${error}`);
  }
}

// 组件的增删改、值写入以及供自定义函数调用的模组方法
export function useCompActions() {
  const componentStore = useComponentsStore();
  const { persist } = usePersistence();

  const MODS = {
    setdata: (label, value) => {
      componentStore.setValue(label, value);
      persist();
    },
    setrequired: (label, value) => {
      componentStore.setRequired(label, value);
      persist();
    },
    setshowed: (label, value) => {
      componentStore.setShowed(label, value);
      persist();
    },
  };

  function setValue(item, v, selectValue) {
    componentStore.setValue(item.id, v);
    persist();
    runFun(item?.fun, FUN_ARGS, [item.value, "", "", selectValue, item, ElMessage, MODS], item.id);
  }

  function setSubValue(item, b, v) {
    componentStore.setSubValue(item.id, b, v);
    persist();
    runFun(item?.fun, SUB_FUN_ARGS, ["", b, v, item, ElMessage, MODS], item.id);
  }

  function removeItem(item) {
    componentStore.removeItem(item);
    persist();
  }

  function importJson() {
    ElMessageBox.prompt("请输入导入JSON", "请输入参数", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    })
      .then(({ value }) => {
        if ((value ?? "") === "") return;
        const back = cloneDeep(componentStore.components);
        try {
          const vs = [...new Function(`return ${value}`)()];
          vs.forEach((it) => (it.id = uuid()));
          componentStore.components.push(...vs);
        } catch (_e) {
          componentStore.components = back;
        }
      })
      .catch(() => {})
      .finally(() => {
        persist();
      });
  }

  function clearAll() {
    componentStore.components = [];
    persist();
  }

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(componentStore.components)).then(() => {});
  }

  return { setValue, setSubValue, removeItem, importJson, clearAll, copyJson };
}
