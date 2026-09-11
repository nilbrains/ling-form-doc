<script setup>
import { computed } from "vue";
import { SIMPLE_PROPS, parseOptionCheck, parseOptionInput } from './comp';
import CompShell from './CompShell.vue';
import { useComponentsStore } from '@/store/comps';
const componentStore = useComponentsStore();

const props = defineProps(SIMPLE_PROPS)
const emit = defineEmits(["val", "remove", "sub-val"])

// 单选框与多选框结构完全一致，仅取值行为与 input type 不同，由组件类型区分
const isRadio = computed(() => props.type === "RADIO")

const modelValue = computed(() => {
    const v = props.value
    if (Array.isArray(v)) {
        return v.map((it) => `${it}`).filter((it) => it !== "")
    }
    return `${v ?? ""}`.split(",").filter((it) => it !== "")
})

// 单选直接回传当前值；多选基于点击后的勾选态增删
function setVal(val, checked) {
    if (isRadio.value) {
        emit("val", val)
        return
    }
    const next = new Set(modelValue.value)
    if (checked) {
        next.add(val)
    } else {
        next.delete(val)
    }
    emit("val", [...next].join())
}

const selectOptions = computed(() => {
    if (props?.optionValue !== "" && props?.optionValue !== "default") {
        return componentStore.options[props.id]?.map((it) => ({
            label: it.field_name,
            value: it.field_value,
        }))
    } else {
        return parseOptionCheck(props.optionCheck).map((it) => ({
            ...it,
            input: parseOptionInput(it.label),
        }))
    }
})

function setSubVal(name, e) {
    emit("sub-val", name, e.target.value)
}

</script>

<template>
    <comp-shell class="ling-comp-check" :span="span" :showed="showed" :readonly="readonly" :required="required"
        @remove="$emit('remove')">
        <label v-if="showTitle === '1'">{{ title || '' }}</label>
        <div class="check-list">
            <div v-for="item in selectOptions" :key="`${id}_${item.value}`">
                <input :type="isRadio ? 'radio' : 'checkbox'" :id="`${id}_${item.value}`" :name="id"
                    :value="`${item.value}`" :checked="modelValue.includes(`${item.value}`)"
                    @click.stop="setVal(`${item.value}`, $event.target.checked)" />
                <label v-if="!('name' in (item?.input || {}))" class="ling-label" :for="`${id}_${item.value}`">{{
                    item.label }}</label>
                <label v-else class="ling-label" :for="`${id}_${item.value}`">
                    <span>{{ item.input.prev || "" }}</span>
                    <input class="inner" :type="'text'" :value="childrens[item.input.name]" :style="{
                        width: `${item.input.width}px`
                    }" @change="e => setSubVal(item.input.name, e)">
                    <span>{{ item.input.next || "" }}</span>
                </label>
            </div>
        </div>
        <span v-if="showFooter === '1'">{{ footer || '' }}</span>
    </comp-shell>
</template>

<style lang="less" scoped></style>
