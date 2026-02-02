<script setup>
import { onMounted } from "vue"
import { SIMPLE_PROPS } from './comp';
import { computed } from "vue";
import IconRemove from './icon/IconRemove.vue';
import { useComponentsStore } from '@/store/comps';
const componentStore = useComponentsStore();

const props = defineProps(SIMPLE_PROPS)
const emit = defineEmits(["val", "remove", "sub-val"])


onMounted(() => {
})

function setVal() {
    const _ = []
    document.querySelectorAll(`[name="${props.id}"]`).forEach(it => {
        if (it.checked) {
            _.push(it.value)
        }
    })
    emit("val", _.join())
}



const modelValue = computed(() => {
    return props.value.includes(',') ? props.value.split(',') : [props.value];
})

function genInput(option) {
    if ((option ?? "").indexOf("INPUT") === 0) {
        const [, prev, name, width, next] = (option ?? "").split("@");
        return {
            prev, name, width, next
        }
    }
    return null;
}


const selectOptions = computed(() => {
    if (props?.optionValue !== "" && props?.optionValue !== "default") {
        return componentStore.options[props.id]?.map((it) => ({
            label: it.field_name,
            value: it.field_value,
        }))
    } else {
        const options = props.optionCheck;
        const _ = options.split(/\n/).filter(it => it != "");
        return _.map(it => {
            const __ = it.split(":");
            return ({
                label: (__[1] || __[0]).trim(),
                value: __[0].trim(),
                input: genInput((__[1] || __[0]).trim())
            })
        });
    }
})

function setSubVal(name, e) {
    emit("sub-val", name, e.target.value)
}

</script>

<template>
    <div class="ling-comp ling-comp-check" :style="{
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
        <div class="check-list">
            <div v-for="(item, index) in selectOptions" :key="`${id}_${item.value}`">
                <input type="radio" :id="`${id}_${item.value}`" :name="id" :value="`${item.value}`"
                    :checked="modelValue.includes(item.value)" @click.stop="setVal" />
                <label v-if="!('name' in (item?.input || {}))" class="ling-label" :for="`${id}_${item.value}`">{{
                    item.label
                }}</label>
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
    </div>
</template>

<style lang="less" scoped></style>
