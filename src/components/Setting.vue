<script setup>
import { ref, watch } from "vue";
import CodePanel from "./item/CodePanel.vue";
import { useComponentsStore } from "../store/comps";


const componentStore = useComponentsStore();

const config = ref({});

const spanValue = ref([0, 0]);
function loadConfig(_config) {
  config.value = Object.assign({}, { ..._config });
  const _reg = /auto \/ (\d+) \/ auto \/ (\d+)/.exec(
    _config?.span || "auto / 1 / auto / 25",
  );
  spanValue.value = [+_reg[1], +_reg[2]];
  componentStore.settingId = _config.id;
}

function changeSpanValue() {
  config.value.span = `auto / ${spanValue.value[0]} / auto / ${spanValue.value[1]}`;
}

defineExpose({
  loadConfig,
  getConfig() {
    return config.value;
  }
});

const emits = defineEmits(["save", "genStyle"]);

watch(
  () => config.value,
  () => {
    emits("save", config.value);
  },
  { deep: true },
);

const codeDialog = ref(false);

function openEditor() {
  codeDialog.value = true;
}


</script>

<template>
  <!-- <el-drawer title="" :with-header="false"> -->
  <el-scrollbar height="100vh">
    <el-form :model="config" label-width="auto" :label-position="`top`" size="small">
      <el-scrollbar class="nil-destion-scrollbar">
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
          <el-select
            v-model="config.type"
          >
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
        <el-form-item label="取消默认导入" :label-position="`left`" v-if="'SELECT' == config.type || 'CHECK' == config.type || 'RADIO' == config.type">
          <el-switch v-model="config.unAutoLoad" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否多选" :label-position="`left`" v-if="'SELECT' == config.type">
          <el-switch v-model="config.multipled" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="分页搜索" :label-position="`left`" v-if="'SELECT' == config.type">
          <el-switch v-model="config.paged" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="选项键值(远程)" v-if="'SELECT' == config.type || 'CHECK' == config.type || 'RADIO' == config.type">
          <el-input v-model="config.optionValue" />
        </el-form-item>
        <el-form-item label="选项键值(分割':')" v-if="'SELECT' == config.type || 'CHECK' == config.type || 'RADIO' == config.type">
          <el-input type="textarea" v-model="config.optionCheck" :rows="7" />
        </el-form-item>
        <el-form-item label="组件值">
          <el-input v-model="config.value" />
        </el-form-item>
        <el-form-item label="定位跨度">
          <el-slider v-model="spanValue" range show-stops :min="1" :max="31" @change="changeSpanValue" />
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
        <el-form-item label="自定义样式" @change="$emit('genStyle')">
          <el-input type="textarea" v-model="config.css" :rows="7" />
        </el-form-item>
        <el-form-item label="监听函数">
          <el-input type="text" v-model="config.fun" aria-readonly="true" readonly @click="openEditor" />
        </el-form-item>
        <el-form-item label="监听数据项" v-if="'SELECT' == config.type">
          <el-input type="text" v-model="config.func" />
        </el-form-item>
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
</style>
