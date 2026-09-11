import { defineStore } from "pinia";
import { ref } from "vue";

const DEF_CONFIG = {
  design: true,
  // design: false,
  // {type: "primary", method: "", text: ""}
  buttons: [],
};

export const useConfigStore = defineStore("config", () => {
  const config = ref(DEF_CONFIG);
  function fillConfig(obj) {
    config.value = Object.assign({}, DEF_CONFIG, obj);
  }
  return { config, fillConfig };
});
