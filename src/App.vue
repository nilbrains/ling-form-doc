<script setup>
import { v4 as uuid } from "uuid";
import {
  defineAsyncComponent,
  onUnmounted,
  onMounted,
  ref,
  computed,
  nextTick,
  watch,
} from "vue";
import { COMP_FUN_MAP } from "./components/comp";
import Setting from "./components/Setting.vue";
import { debounce } from "./utils/index";
import flatpickr from "flatpickr";
import { Mandarin } from "flatpickr/dist/l10n/zh";
import "flatpickr/dist/themes/airbnb.css";
import { removeDataListener, setDataEmitter } from "./components/mitt";
import { useComponentsStore } from "./store/comps";
import { useConfigStore } from "./store/config";
import { useLingApp } from "./utils/LingApp";
import { cloneDeep } from "lodash-es";
import { api } from "./utils/api";
import CustomComps from "./components/CustomComps.vue";
import { useMagicKeys, whenever } from "@vueuse/core";

const configStore = useConfigStore();
const componentStore = useComponentsStore();

const localStorageUse = computed(() => configStore.config.design && true);

const { LingApp } = useLingApp(() => {
  genStyle();
  genSelectOptions();
  setTimeout(() => {
    genDaySelect();
  }, 800);
});

onMounted(() => {
  // if (localStorageUse.value) {
  try {
    LingApp.loadComponents(
      JSON.parse(localStorage.getItem("ling-comps") ?? "[]"),
    );
  } catch (e) {
    LingApp.loadComponents([]);
  }
  // }
});

const COMP_MAP = {
  TEXT: defineAsyncComponent(() => import("./components/CompText.vue")),
  INPUT: defineAsyncComponent(() => import("./components/CompInput.vue")),
  SELECT: defineAsyncComponent(() => import("./components/CompSelect.vue")),
  CHECK: defineAsyncComponent(() => import("./components/CompCheck.vue")),
  RADIO: defineAsyncComponent(() => import("./components/CompRadio.vue")),
  AREA: defineAsyncComponent(() => import("./components/CompArea.vue")),
};

//  ----------- 右键菜单 start -----------
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
  CHANGE_WIDTH: [
    { key: "CHANGE_WIDTH_1_31", name: "整行" },
    { key: "CHANGE_WIDTH_1_16", name: "二等分前" },
    { key: "CHANGE_WIDTH_16_31", name: "二等分后" },
    { key: "CHANGE_WIDTH_1_11", name: "三等分1" },
    { key: "CHANGE_WIDTH_11_21", name: "三等分2" },
    { key: "CHANGE_WIDTH_21_31", name: "三等分3" },
    { key: "CHANGE_WIDTH_1_8", name: "四等分1" },
    { key: "CHANGE_WIDTH_8_15", name: "四等分2" },
    { key: "CHANGE_WIDTH_15_22", name: "四等分3" },
    { key: "CHANGE_WIDTH_22_29", name: "四等分4" },
    { key: "START", name: "返回主菜单" },
  ],
};

const NOW_MENU = ref("START");

const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
});
const dropdownRef = ref(null);
const triggerRef = ref({
  getBoundingClientRect: () => position.value,
});
// ling-doc 注册右键点击事件
function handleContextmenuInLingDoc(event) {
  const { clientX, clientY } = event;
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY,
  });
  event.preventDefault();
  dropdownRef.value?.handleOpen(event.target);
}

function lingDocCommand(cmd) {
  if (!configStore.config.design) {
    return;
  }
  // 判断有无下级菜单
  if (cmd in RIGHT_MENU) {
    NOW_MENU.value = cmd;
    dropdownRef.value?.handleOpen();
  } else {
    if (cmd in COMP_FUN_MAP) {
      COMP_FUN_MAP[cmd](
        componentStore,
        () => {
          localStorageUse.value &&
            localStorage.setItem(
              "ling-comps",
              JSON.stringify(componentStore.components),
            );
          NOW_MENU.value = "START";
        },
        settingRef.value?.getConfig() || {},
      );
    }
    // 开始分发事件
  }
}
//  ----------- 右键菜单 end -----------

// ----------- 渲染自定义样式 start -----------

function genStyle() {
  let cssStyles = componentStore.genStyle();
  if (document.querySelector(`style#ling-doc-style`)) {
    document.querySelector(`style#ling-doc-style`).innerHTML = cssStyles;
  } else {
    const docStyleDom = document.createElement("style");
    docStyleDom.setAttribute("id", "ling-doc-style");
    docStyleDom.innerHTML = cssStyles;
    document.head.appendChild(docStyleDom);
  }
}

function genDaySelect() {
  if (!configStore.config.design) {
    flatpickr(`[type="date"]`, { locale: Mandarin });
    flatpickr(`[type="datetime-local"]`, {
      locale: Mandarin,
      enableTime: true,
    });
  }
}

// 初始化 options
function genSelectOptions() {
  if (!configStore.config.design) {
    const __ = componentStore.components.filter(
      (op) =>
        ["SELECT", "RADIO", "CHECK"].includes(op.type) && "1" != op.unAutoLoad,
    );
    const dickAllPost = api.Post(window.config?.dictAllUrl, __);
    dickAllPost.send().then((res) => {
      componentStore.options = res.data?.data || {};
    });
  }
}

watch(
  () => configStore.config.design,
  () => {
    genDaySelect();
    genSelectOptions();
  },
);

// ----------- 渲染自定义样式 end -----------

// 配置内容
const settingRef = ref();
const showSetting = ref(false);

function openSettingConfig(item) {
  if (!item) {
    settingRef.value && settingRef.value?.loadConfig({});
  }
  if (!configStore.config.design) {
    return;
  }
  showSetting.value = true;
  settingRef.value && settingRef.value?.loadConfig(item);
}

function autoSaveItem(itemConfig) {
  debounce(() => {
    componentStore.chengeItem(itemConfig?.id, itemConfig);
    localStorageUse.value &&
      localStorage.setItem(
        "ling-comps",
        JSON.stringify(componentStore.components),
      );
  }, 500)();
}

const MODS = {
  setdata: (label, value) => {
    componentStore.setValue(label, value);
    localStorageUse.value &&
      localStorage.setItem(
        "ling-comps",
        JSON.stringify(componentStore.components),
      );
  },
  setrequired: (label, value) => {
    componentStore.setRequired(label, value);
    localStorageUse.value &&
      localStorage.setItem(
        "ling-comps",
        JSON.stringify(componentStore.components),
      );
  },
  setshowed: (label, value) => {
    componentStore.setRequired(label, value);
    localStorageUse.value &&
      localStorage.setItem(
        "ling-comps",
        JSON.stringify(componentStore.components),
      );
  },
};

function setValue(item, v, selectValue) {
  // console.log(selectValue);
  componentStore.setValue(item.id, v);
  localStorageUse.value &&
    localStorage.setItem(
      "ling-comps",
      JSON.stringify(componentStore.components),
    );
  // 尝试执行fun自定义函数
  try {
    const fun = new Function(
      "value",
      "subKey",
      "subValue",
      "selectValue",
      "item",
      "msg",
      "mods",
      item?.fun || "",
    );
    fun(item.value, "", "", selectValue, item, ElMessage, MODS);
  } catch (error) {
    console.error(`[${item.id}]自定义函数错误: ${error}`);
  }
}

function setSubValue(item, b, v) {
  componentStore.setSubValue(item.id, b, v);
  localStorageUse.value &&
    localStorage.setItem(
      "ling-comps",
      JSON.stringify(componentStore.components),
    );

  // 尝试执行fun自定义函数
  try {
    const fun = new Function(
      "value",
      "subKey",
      "subValue",
      "item",
      "msg",
      "mods",
      item?.fun || "",
    );
    fun("", b, v, item, ElMessage, MODS);
  } catch (error) {
    console.error(`[${item.id}]自定义函数错误: ${error}`);
  }
}

function removeItem(item) {
  componentStore.removeItem(item);
  localStorageUse.value &&
    localStorage.setItem(
      "ling-comps",
      JSON.stringify(componentStore.components),
    );
}

function inputJson() {
  ElMessageBox.prompt("请输入导入JSON", "请输入参数", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(({ value }) => {
      if ((value ?? "") !== "") {
        const back = cloneDeep(componentStore.components);
        try {
          const vs = [...new Function(`return ${value}`)()];
          vs.forEach((it) => (it.id = uuid()));
          componentStore.components.push(...vs);
        } catch (_e) {
          componentStore.components = back;
        }
      }
    })
    .catch(() => {})
    .finally(() => {
      localStorageUse.value &&
        localStorage.setItem(
          "ling-comps",
          JSON.stringify(componentStore.components),
        );
    });
}

function clearJson() {
  componentStore.components = [];
  localStorageUse.value &&
    localStorage.setItem(
      "ling-comps",
      JSON.stringify(componentStore.components),
    );
}

function saveJson() {
  navigator.clipboard
    .writeText(JSON.stringify(componentStore.components))
    .then(() => {});
}

watch(
  () => componentStore.components,
  () => {
    setDataEmitter(componentStore.components);
  },
  { deep: true },
);

onUnmounted(() => {
  removeDataListener();
});

// 监听快捷键

const keys = useMagicKeys();

whenever(keys.control_arrowup, () => {
  if(configStore.config.design) {
  const f = settingRef.value.getConfig();
  const idx = componentStore.findIndex(f.id);
  componentStore.swapItem(idx, true)
  localStorageUse.value &&
    localStorage.setItem(
      "ling-comps",
      JSON.stringify(componentStore.components),
    );
  }
});

whenever(keys.control_arrowdown, () => {
  if(configStore.config.design) {
  const f = settingRef.value.getConfig();
  const idx = componentStore.findIndex(f.id);
  componentStore.swapItem(idx, false)
  localStorageUse.value &&
    localStorage.setItem(
      "ling-comps",
      JSON.stringify(componentStore.components),
    );
  }
});
</script>

<template>
  <div
    class="ling-doc-window"
    :class="{
      'ling-editor': configStore.config.design,
      'ling-write': !configStore.config.design,
    }"
  >
    <setting
      class="ling-setting"
      v-if="configStore.config.design"
      ref="settingRef"
      @save="autoSaveItem"
      @gen-style="genStyle"
    />
    <div
      class="option-bar"
      :class="{
        left: configStore.config.design,
      }"
    >
      <div class="inner">
        <div class="l" style="display: flex; gap: 4px">
          <el-switch v-model="configStore.config.design" />
          <el-button text @click="inputJson">导入</el-button>
          <el-button text @click="clearJson">清空</el-button>
          <el-button text @click="saveJson">复制</el-button>
        </div>
        <div class="r">
          <el-button
            v-for="(item, index) in configStore.config.buttons"
            :type="item.type"
            @click.stop="() => item?.method && item.method()"
            >{{ item.text || "-" }}</el-button
          >
        </div>
      </div>
    </div>
    <!-- <el-button @click="componentStore.clearValue"> 清空 </el-button> -->
    <div
      class="ling-doc-inner"
      :class="{
        left: configStore.config.design,
      }"
      style="padding-top: 80px"
    >
      <div
        class="ling-doc-wrapper"
        @contextmenu="handleContextmenuInLingDoc"
        @click="() => openSettingConfig()"
      >
        <div class="ling-doc">
          <template v-for="item in componentStore.components" :key="item.id">
            <component
              :is="COMP_MAP[item.type || 'TEXT']"
              v-bind="item"
              @click.stop="() => openSettingConfig(item)"
              :ling-key="item.id"
              @val="(v, ...aaa) => setValue(item, v, ...aaa)"
              @sub-val="(b, v) => setSubValue(item, b, v)"
              @remove="removeItem(item)"
              @contextmenu="() => openSettingConfig(item)"
              :class="{
                'now-select': componentStore.settingId == item.id
              }"
            >
            </component>
          </template>
        </div>
      </div>
    </div>
    <el-dropdown
      ref="dropdownRef"
      :virtual-ref="triggerRef"
      :show-arrow="false"
      :popper-options="{
        modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
      }"
      virtual-triggering
      trigger="contextmenu"
      placement="bottom-start"
      @command="lingDocCommand"
    >
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in RIGHT_MENU[NOW_MENU]"
            :key="item.key"
            :command="item.key"
          >
            {{ item.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <custom-comps class="ling-components" v-if="configStore.config.design" />
  </div>
</template>

<style lang="less" scoped></style>
