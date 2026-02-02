<script setup>
import { onMounted } from "vue"
import { SIMPLE_PROPS } from './comp';
import IconRemove from './icon/IconRemove.vue';
import { useComponentsStore } from '@/store/comps';
const componentStore = useComponentsStore();
const emit = defineEmits(["val","remove", "sub-val"])

const props = defineProps(SIMPLE_PROPS)

onMounted(() => {
})
</script>

<template>
    <div class="ling-comp ling-comp-text" :style="{
        'grid-area': span
    }" :class="{
        readonly: readonly === '1',
        required: required === '1',
        showed: showed === '1'
    }">
        <div class="remove" @click.stop="$emit('remove')">
            <icon-remove />
        </div>
        {{ value || '' }}
    </div>
</template>

<style lang="less" scoped></style>
