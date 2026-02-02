<script setup>
import { SIMPLE_PROPS } from './comp';
import { computed, onMounted } from "vue";
import { ref } from "vue";
import { api } from "@/utils/api";
import { listenerDataChange } from './mitt';
import IconRemove from './icon/IconRemove.vue';
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
        const options = props.optionCheck;
        const _ = options.split(/\n/).filter(it => it != "");
        return _.map(it => {
            const __ = it.split(":");
            return ({
                field_name: (__[1] || __[0]).trim(),
                field_value: __[0].trim(),
            })
        });
    }
})

const removeOptions = ref([])

const loading = ref(false)

function loadData(query, topId = "", topType = "") {
    if (configStore.config.design) {
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
    return props.value.includes(',') ? props.value.split(',') : props.value;
})

const lastValue = ref(props.optionValue)

// 监听数据内容
if ((props.func ?? "") != "") {
    listenerDataChange((items) => {
        const _ = items.filter(it => it.label === props.func)
        if ([..._]?.length > 0) {
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

onMounted(() => {
    // console.log(componentStore.options[props.id]);

    // if (props.func) {
    // const _ = componentStore.getComponent(props.func);
    // if (_) {
    // loadData("", _?.value || "", _?.optionValue || "");
    // }
    // } else {
    // loadData("")
    // }
})

function openPanel(v) {
    if (v) {
        return;
    }
}

</script>

<template>
    <div class="ling-comp ling-comp-input" :style="{
        'grid-area': span
    }" :class="{
        readonly: readonly === '1',
        required: required === '1',
        showed: showed === '1'
    }">
        <div class="remove" @click.stop="$emit('remove')">
            <icon-remove />
        </div>
        <label v-if="showTitle === '1'">{{ title || '' }}</label>
        <el-select v-if="paged != '1'" :multiple="multipled === '1'" :model-value="modelValue || ''" @change="setVal"
            @visible-change="openPanel" :placeholder="placeholder || ''">
            <el-option v-for="item in realOptions" :key="item.field_value" :label="item.field_name"
                :value="item.field_value">
                <span style="float: left">{{ item.field_name }}</span>
                <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                    {{ item.field_value }}
                </span>
            </el-option>
        </el-select>
        <el-select v-else :multiple="multipled === '1'" :model-value="modelValue || ''" @change="setVal" filterable
            remote :remote-method="remoteMethod" :loading="loading" :placeholder="placeholder || ''"
            @visible-change="openPanel">
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
    </div>
</template>

<style lang="less" scoped></style>
