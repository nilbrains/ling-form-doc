import { defineStore } from "pinia";
import { ref, nextTick } from "vue";

export const useComponentsStore = defineStore("components", () => {
  const components = ref([]);
  const options = ref({});
  const settingId = ref("");

  function fill(arr, cb = () => {}) {
    components.value = arr;
    nextTick(() => {
      cb();
    });
  }

  function push(...args) {
    components.value.push(...args);
  }

  function genStyle() {
    let cssStyles = "";
    components.value.forEach((it) => {
      cssStyles += `[ling-key="${it.id}"]{${it.css || ""}}`;
    });
    return cssStyles;
  }

  function findIndex(id) {
    return components.value.findIndex((it) => it.id === id);
  }

  function chengeItem(id, itemConfig) {
    const idx = components.value.findIndex((it) => it.id === id);
    components.value[idx] = itemConfig;
  }

  function setValue(id, value) {
    const idx = components.value.findIndex(
      (it) => it.id === id || it.label === id,
    );
    components.value[idx].value = value;
  }

  function setRequired(id, value) {
    const idx = components.value.findIndex(
      (it) => it.id === id || it.label === id,
    );
    components.value[idx].required = value;
  }

  function setShowed(id, value) {
    const idx = components.value.findIndex(
      (it) => it.id === id || it.label === id,
    );
    components.value[idx].showed = value;
  }

  function setSubValue(id, b, v) {
    const idx = components.value.findIndex(
      (it) => it.id === id || it.label === id,
    );
    if (!("childrens" in components.value[idx])) {
      components.value[idx].childrens = {};
    }
    components.value[idx].childrens[`${b}`] = v;
  }

  function removeItem(item) {
    const _idx = components.value.indexOf(item);
    components.value.splice(_idx, 1);
  }

  function getComponent(label) {
    const _ = components.value.filter((it) => it.label === label);
    if (_.length > 0) {
      return _[0];
    } else {
      return null;
    }
  }

  function clearValue() {
    components.value.forEach((it) => {
      if (["SELECT", "RADIO", "CHECK", "INPUT"].includes(it.type)) {
        it.value = "";
      }
      const arr = Object.keys(it?.childrens || {});
      if (arr.length > 0) {
        arr.forEach((iti) => {
          it.childrens[iti] = "";
        });
      }
    });
  }

  function swapItem(i, flag) {
    if (flag) {
      let j = i - 1;
      j >= 0 &&
        ([components.value[i], components.value[j]] = [
          components.value[j],
          components.value[i],
        ]);
    } else {
      let j = i + 1;
      j < components.value.length &&
        ([components.value[i], components.value[j]] = [
          components.value[j],
          components.value[i],
        ]);
    }
  }

  return {
    swapItem,
    components,
    options,
    fill,
    push,
    removeItem,
    setSubValue,
    genStyle,
    findIndex,
    chengeItem,
    setValue,
    setShowed,
    setRequired,
    getComponent,
    clearValue,
    settingId
  };
});
