<script setup>
import { onMounted } from "vue"
import { SIMPLE_PROPS } from './comp';
import IconRemove from './icon/IconRemove.vue';
import { useComponentsStore } from '@/store/comps';
const componentStore = useComponentsStore();

const props = defineProps(SIMPLE_PROPS)
const emit = defineEmits(["val","remove"])


onMounted(() => {
})

function setVal(e) {
    emit("val", e.target.value)
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
        <input :type="inputType || 'text'" :value="value" @change="setVal">
        <span v-if="showFooter === '1'">{{ footer || '' }}</span>
    </div>
</template>

<style lang="less" scoped></style>
