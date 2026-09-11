<script setup>
import { defineAsyncComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import Setting from "./components/Setting.vue";
import CustomComps from "./components/CustomComps.vue";
import { removeDataListener, setDataEmitter } from "./components/mitt";
import { useComponentsStore } from "./store/comps";
import { useConfigStore } from "./store/config";
import { useLingApp } from "./utils/LingApp";
import { useCompActions } from "./composables/useCompActions";
import { useContextMenu } from "./composables/useContextMenu";
import { useDictOptions } from "./composables/useDictOptions";
import { useDocStyle } from "./composables/useDocStyle";
import { usePersistence } from "./composables/usePersistence";
import { useShortcuts } from "./composables/useShortcuts";

const configStore = useConfigStore();
const componentStore = useComponentsStore();

// 未匹配到的类型（含历史遗留的 AREA）统一按文本渲染兜底
const COMP_MAP = {
  TEXT: defineAsyncComponent(() => import("./components/CompText.vue")),
  INPUT: defineAsyncComponent(() => import("./components/CompInput.vue")),
  SELECT: defineAsyncComponent(() => import("./components/CompSelect.vue")),
  CHECK: defineAsyncComponent(() => import("./components/CompChoice.vue")),
  RADIO: defineAsyncComponent(() => import("./components/CompChoice.vue")),
};

const { genStyle } = useDocStyle();
const { genSelectOptions } = useDictOptions();
const { persist, readStored } = usePersistence();
const { setValue, setSubValue, removeItem, importJson, clearAll, copyJson } = useCompActions();

// ----------- 设置面板 -----------
const settingRef = ref();

// 取当前选中组件的配置，供右键菜单与快捷键使用
const getActiveComp = () => settingRef.value?.getConfig() || {};

function openSettingConfig(item) {
  if (!item) {
    settingRef.value?.loadConfig({});
  }
  if (!configStore.config.design) return;
  settingRef.value?.loadConfig(item);
}

// 防抖函数必须在 setup 顶层创建一次，否则每次调用都是新闭包，防抖失效
const autoSaveDebounced = useDebounceFn((payload) => {
  if (!payload?.targetId) return;
  componentStore.chengeItem(payload.targetId, payload.patch);
  // “组件ID”被改动时同步选中态，否则后续编辑就定位不到这个组件了
  if (payload.patch?.id && payload.patch.id !== payload.targetId) {
    componentStore.settingId = payload.patch.id;
  }
  // 自定义样式改动后重新生成注入的样式表
  if (payload.patch?.css !== undefined) {
    genStyle();
  }
  persist();
}, 500);

// 设置面板只上报发生变化的字段
function autoSaveItem(payload) {
  autoSaveDebounced(payload);
}

// 拖动调宽：拖动中实时更新跨度（不写存储），松手后再持久化
function onCompResize(id, span) {
  componentStore.chengeItem(id, { span });
  settingRef.value?.patchConfig(id, { span });
}

// ----------- 右键菜单与快捷键 -----------
const { RIGHT_MENU, nowMenu, dropdownRef, triggerRef, openMenu, handleCommand } =
  useContextMenu({ getActiveComp });

useShortcuts({ getActiveComp });

// ----------- 生命周期 -----------
const { LingApp } = useLingApp(() => {
  genStyle();
  genSelectOptions();
});

onMounted(() => {
  LingApp.loadComponents(readStored());
});

watch(
  () => configStore.config.design,
  () => {
    genSelectOptions();
  },
);

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
          <el-button text @click="importJson">导入</el-button>
          <el-button text @click="clearAll">清空</el-button>
          <el-button text @click="copyJson">复制</el-button>
        </div>
        <div class="r">
          <el-button
            v-for="(item, index) in configStore.config.buttons"
            :key="index"
            :type="item.type"
            @click.stop="() => item?.method && item.method()"
            >{{ item.text || "-" }}</el-button
          >
        </div>
      </div>
    </div>
    <div
      class="ling-doc-inner"
      :class="{
        left: configStore.config.design,
      }"
      style="padding-top: 80px"
    >
      <div
        class="ling-doc-wrapper"
        @contextmenu="openMenu"
        @click="() => openSettingConfig()"
      >
        <div class="ling-doc">
          <div v-if="configStore.config.design && componentStore.components.length === 0" class="ling-doc-empty">
            右键「添加组件」，或从右侧组件面板选择
          </div>
          <template v-for="item in componentStore.components" :key="item.id">
            <component
              :is="COMP_MAP[item.type] || COMP_MAP.TEXT"
              v-bind="item"
              @click.stop="() => openSettingConfig(item)"
              :ling-key="item.id"
              :ling-name="item.title || item.label || item.type"
              @val="(v, ...aaa) => setValue(item, v, ...aaa)"
              @sub-val="(b, v) => setSubValue(item, b, v)"
              @remove="removeItem(item)"
              @contextmenu="() => openSettingConfig(item)"
              @resize="(span) => onCompResize(item.id, span)"
              @resize-end="persist"
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
      @command="handleCommand"
    >
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in RIGHT_MENU[nowMenu]"
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
