<script setup>
import { SIMPLE_PROPS, parseOptionCheck } from './comp';
import { computed, onUnmounted } from "vue";
import { ref } from "vue";
import { api } from "@/utils/api";
import { listenerDataChange } from './mitt';
import CompShell from './CompShell.vue';
import { useComponentsStore } from '@/store/comps';
import { useConfigStore } from '@/store/config';
const configStore = useConfigStore();
const componentStore = useComponentsStore();

const props = defineProps(SIMPLE_PROPS)
const emit = defineEmits(["val", "remove"])

function setVal(e) {
    const __ = realOptions.value.filter(it => it.field_value == e)[0];
    emit("val", e, __)
}

const realOptions = computed(() => {
    if (props?.optionValue !== "" && props?.optionValue !== "default") {
        if (removeOptions.value.length == 0) {
            return componentStore.options[props.id];
        } else {
            return removeOptions.value
        }
    } else {
        return parseOptionCheck(props.optionCheck).map((it) => ({
            field_name: it.label,
            field_value: it.value,
        }));
    }
})

const removeOptions = ref([])

const loading = ref(false)

function loadData(query, topId = "", topType = "") {
    if (configStore.config.design) {
        return;
    }
    // 宿主未配置字典接口时不发请求，避免误请求当前页面地址
    if (!window.config?.dictUrl) {
        return;
    }
    loading.value = true;
    let getDictDo = null;
    if (props.paged != "1") {
        getDictDo = api.Get(window.config?.dictUrl, {
            params: (topType != "") ? {
                lastValue: props.value,
                fieldCode: topType,
                parentId: topId || props.optionValue,
            } : {
                lastValue: props.value,
                [`${/\d+/.test((topId || props.optionValue)) ? 'parentId' : 'fieldCode'}`]: topId || props.optionValue
            },
            cacheFor: null
        })
    } else {
        getDictDo = api.Get(window.config?.dictUrl, {
            params: {
                searchTxt: query.trim(),
                lastValue: props.value,
                isPage: "1",
                fieldCode: topId || props.optionValue,
                pageIndex: pageNum.value
            },
            cacheFor: null
        })
    }
    if ((query ?? "") !== "") {
        getDictDo = getDictDo.send(true);
    }
    getDictDo.then(res => {
        const rs = res?.data?.data;
        removeOptions.value = rs?.data || [];
    })
        .catch((e) => {
            console.error(`query search error: ${e}`);
        })
        .finally(() => {
            loading.value = false;
        })
}


const qqqq = ref("")

function remoteMethod(query) {
    if (query) {
        qqqq.value = query;
        pageNum.value = 0;
        loadData(query);
    } else {
        // removeOptions.value = 
    }
}


const pageNum = ref(0);

function nextPage() {
    if (loading.value) {
        return;
    }
    pageNum.value++;
    loadData(qqqq.value);
}

function prevPage() {
    if (loading.value) {
        return;
    }
    pageNum.value >= 1 && pageNum.value--;
    loadData(qqqq.value);
}


const modelValue = computed(() => {
    const v = props.value
    // 多选返回数组、单选返回字符串，避免非字符串值导致 includes 报错
    if (Array.isArray(v)) {
        return props.multipled === "1" ? v.map((it) => `${it}`) : `${v[0] ?? ""}`
    }
    const text = `${v ?? ""}`
    return props.multipled === "1" ? text.split(",").filter((it) => it !== "") : text
})

const lastValue = ref(props.optionValue)

// 监听数据内容，卸载时只解绑自己的监听
let removeListener = null;
if ((props.func ?? "") !== "") {
    removeListener = listenerDataChange((items) => {
        const _ = items.filter(it => it.label === props.func)
        if (_?.length > 0) {
            const itemValue = _[0]?.value || "";
            if (itemValue !== lastValue.value) {
                lastValue.value = itemValue;
                qqqq.value = "";
                pageNum.value = 0;
                itemValue && loadData("", itemValue, _[0]?.optionValue || "");
            }
        }
    })
}

onUnmounted(() => {
    removeListener?.();
})
</script>

<template>
    <comp-shell class="ling-comp-input" :span="span" :showed="showed" :readonly="readonly" :required="required"
        @remove="$emit('remove')">
        <label v-if="showTitle === '1'">{{ title || '' }}</label>
        <el-select v-if="paged != '1'" :multiple="multipled === '1'" :model-value="modelValue || ''" @change="setVal"
            :placeholder="placeholder || ''">
            <el-option v-for="item in realOptions" :key="item.field_value" :label="item.field_name"
                :value="item.field_value">
                <span style="float: left">{{ item.field_name }}</span>
                <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                    {{ item.field_value }}
                </span>
            </el-option>
        </el-select>
        <el-select v-else :multiple="multipled === '1'" :model-value="modelValue || ''" @change="setVal" filterable
            remote :remote-method="remoteMethod" :loading="loading" :placeholder="placeholder || ''">
            <el-option v-for="item in realOptions" :key="item.field_value" :label="item.field_name"
                :value="item.field_value">
                <span style="float: left">{{ item.field_name }}</span>
                <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                    {{ item.field_value }}
                </span>
            </el-option>
            <template #footer>
                <el-button v-if="pageNum >= 1" text bg size="small" @click="prevPage">
                    上一页
                </el-button>
                <el-button text bg size="small" @click="nextPage">
                    下一页
                </el-button>
            </template>
        </el-select>
        <span v-if="showFooter === '1'">{{ footer || '' }}</span>
    </comp-shell>
</template>

<style lang="less" scoped></style>
