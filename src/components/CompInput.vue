<script setup>
import { nextTick, onUnmounted, ref, watch } from "vue"
import flatpickr from "flatpickr";
import { Mandarin } from "flatpickr/dist/l10n/zh";
import "flatpickr/dist/themes/airbnb.css";
import { SIMPLE_PROPS } from './comp';
import CompShell from './CompShell.vue';
import { useConfigStore } from '@/store/config';

const configStore = useConfigStore();

const props = defineProps(SIMPLE_PROPS)
const emit = defineEmits(["val", "remove"])

const inputRef = ref(null);
let picker = null;

const PICKER_TYPES = ["date", "datetime-local"];

// 日期类输入只在填写态初始化 flatpickr，组件卸载时销毁，避免重复实例与内存泄漏
function initPicker() {
    if (picker || configStore.config.design) return;
    if (!PICKER_TYPES.includes(props.inputType)) return;
    if (!inputRef.value) return;
    picker = flatpickr(inputRef.value, {
        locale: Mandarin,
        enableTime: props.inputType === "datetime-local",
    });
}

function destroyPicker() {
    picker?.destroy();
    picker = null;
}

watch(
    () => configStore.config.design,
    (design) => {
        if (design) {
            destroyPicker();
        } else {
            nextTick(initPicker);
        }
    },
    { immediate: true },
);

// 外部 loadData 回填时同步给选择器
watch(
    () => props.value,
    (v) => {
        picker?.setDate(v || null, false);
    },
);

onUnmounted(destroyPicker);

function setVal(e) {
    emit("val", e.target.value)
}

</script>

<template>
    <comp-shell class="ling-comp-input" :span="span" :showed="showed" :readonly="readonly" :required="required"
        @remove="$emit('remove')">
        <label v-if="showTitle === '1'">{{ title || '' }}</label>
        <input ref="inputRef" :type="inputType || 'text'" :value="value" @change="setVal">
        <span v-if="showFooter === '1'">{{ footer || '' }}</span>
    </comp-shell>
</template>

<style lang="less" scoped></style>
