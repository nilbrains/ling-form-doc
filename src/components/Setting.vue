<script setup>
import { reactive, ref, watch } from "vue";
import CodePanel from "./item/CodePanel.vue";
import { SIMPLE_PROPS, GRID_LINES, parseSpan, formatSpan } from "./comp";
import { useComponentsStore } from "../store/comps";

const componentStore = useComponentsStore();

const emits = defineEmits(["save"]);

const config = reactive({});

const spanValue = ref([0, 0]);
const DEFAULT_SPAN = [1, 25];

// 面板可编辑字段即组件字段，逐字段 watch 替代整对象 deep watch
const FIELD_KEYS = Object.keys(SIMPLE_PROPS);

// 字段按用途分组，默认全部展开，可按需收起
const activeGroups = ref(["base", "options", "layout", "style"]);

// loadConfig 回填期间屏蔽提交，避免整批赋值被误判成用户修改
let suppressEmit = false;

function emitField(key, value) {
  // 用 store 的选中态定位组件：patch 应用后它会同步更新，因此改完“组件ID”仍能找到目标
  const targetId = componentStore.settingId;
  if (suppressEmit || !targetId) return;
  emits("save", { targetId, patch: { [key]: value } });
}

FIELD_KEYS.forEach((key) => {
  watch(
    () => config[key],
    (value) => emitField(key, value),
    { flush: "sync" },
  );
});

function loadConfig(_config) {
  const source = _config || {};
  suppressEmit = true;
  // 先清空再合并，避免上一个组件的字段残留到当前组件
  Object.keys(config).forEach((key) => delete config[key]);
  Object.assign(config, source);
  componentStore.settingId = source.id ?? "";
  suppressEmit = false;

  spanValue.value = parseSpan(config.span, DEFAULT_SPAN);
}

// 外部（如拖动调宽）改动当前组件的字段时同步到面板，不回写、不触发 save
function patchConfig(id, patch) {
  if (!id || componentStore.settingId !== id) return;
  suppressEmit = true;
  Object.assign(config, patch);
  suppressEmit = false;
  if (patch.span !== undefined) {
    spanValue.value = parseSpan(config.span, DEFAULT_SPAN);
  }
}

function changeSpanValue() {
  config.span = formatSpan(spanValue.value[0], spanValue.value[1]);
}

defineExpose({
  loadConfig,
  patchConfig,
  getConfig() {
    return config;
  }
});

const codeDialog = ref(false);

function openEditor() {
  codeDialog.value = true;
}

</script>

<template>
  <el-scrollbar height="100vh">
    <el-form :model="config" label-width="auto" :label-position="`top`" size="small">
      <el-scrollbar class="nil-destion-scrollbar">
        <el-collapse v-model="activeGroups">
          <el-collapse-item title="基础信息" name="base">
            <el-form-item label="组件ID">
              <template #label>
                <el-space>
                  <span>隐藏组件</span>
                  <el-switch v-model="config.showed" active-value="1" inactive-value="0" />
                </el-space>
              </template>
              <el-input v-model="config.id" />
            </el-form-item>
            <el-form-item label="组件KEY">
              <el-input v-model="config.label" />
            </el-form-item>
            <el-form-item label="">
              <template #label>
                <el-space>
                  <span>组件标题</span>
                  <el-switch v-model="config.showTitle" active-value="1" inactive-value="0" />
                </el-space>
              </template>
              <el-input v-model="config.title" />
            </el-form-item>
            <el-form-item label="">
              <template #label>
                <el-space>
                  <span>组件标尾</span>
                  <el-switch v-model="config.showFooter" active-value="1" inactive-value="0" />
                </el-space>
              </template>
              <el-input v-model="config.footer" />
            </el-form-item>
            <el-form-item label="占位内容">
              <el-input v-model="config.placeholder" />
            </el-form-item>
            <el-form-item label="组件类型">
              <el-select v-model="config.type">
                <el-option label="TEXT" value="TEXT" />
                <el-option label="INPUT" value="INPUT" />
                <el-option label="CHECK" value="CHECK" />
                <el-option label="RADIO" value="RADIO" />
                <el-option label="SELECT" value="SELECT" />
              </el-select>
            </el-form-item>
            <el-form-item label="文本类型" v-if="'INPUT' == config.type">
              <el-input v-model="config.inputType" />
            </el-form-item>
            <el-form-item label="组件值">
              <el-input v-model="config.value" />
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="选项配置" name="options">
            <el-form-item label="取消默认导入" :label-position="`left`"
              v-if="'SELECT' == config.type || 'CHECK' == config.type || 'RADIO' == config.type">
              <el-switch v-model="config.unAutoLoad" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item label="是否多选" :label-position="`left`" v-if="'SELECT' == config.type">
              <el-switch v-model="config.multipled" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item label="分页搜索" :label-position="`left`" v-if="'SELECT' == config.type">
              <el-switch v-model="config.paged" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item label="选项键值(远程)"
              v-if="'SELECT' == config.type || 'CHECK' == config.type || 'RADIO' == config.type">
              <el-input v-model="config.optionValue" />
            </el-form-item>
            <el-form-item label="选项键值(分割':')"
              v-if="'SELECT' == config.type || 'CHECK' == config.type || 'RADIO' == config.type">
              <el-input type="textarea" v-model="config.optionCheck" :rows="7" />
            </el-form-item>
            <el-form-item label="监听数据项" v-if="'SELECT' == config.type">
              <el-input type="text" v-model="config.func" />
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="布局与状态" name="layout">
            <el-form-item label="定位跨度">
              <el-slider v-model="spanValue" range show-stops :min="1" :max="GRID_LINES" @change="changeSpanValue" />
              <el-input v-model="config.span" />
            </el-form-item>
            <el-form-item label="只读项" :label-position="`left`">
              <el-switch v-model="config.readonly" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item label="必填项" :label-position="`left`">
              <el-switch v-model="config.required" active-value="1" inactive-value="0" />
            </el-form-item>
            <el-form-item label="分组">
              <el-input v-model="config.group" />
            </el-form-item>
          </el-collapse-item>

          <el-collapse-item title="样式与事件" name="style">
            <el-form-item label="自定义样式">
              <el-input type="textarea" v-model="config.css" :rows="7" />
            </el-form-item>
            <el-form-item label="监听函数">
              <el-input type="text" v-model="config.fun" aria-readonly="true" readonly @click="openEditor" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-form>
    <el-dialog v-model="codeDialog" :title="`value: 值,subKey 子值名称,subValue 子值, selectValue 选择框对象, item 元素,msg 消息, mods 模组方法`"
      class="ling-dialog">
      <CodePanel :code="config.fun" @val="(code) => (config.fun = code)" />
    </el-dialog>
  </el-scrollbar>
</template>

<style lang="less">
.ling-dialog {
  .el-dialog__body {
    position: relative;
  }
}

.ling-setting {
  // 字段较多，收掉折叠面板自带的边框并压缩间距，让一屏能容下更多内容
  .el-collapse {
    border-top: none;
    border-bottom: none;
  }

  .el-collapse-item__header {
    height: 34px;
    font-size: 13px;
    font-weight: 600;
    border-bottom: none;
  }

  .el-collapse-item__wrap {
    border-bottom: none;
  }

  .el-collapse-item__content {
    padding-bottom: 4px;
  }

  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>
