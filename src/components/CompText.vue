<script setup>
import { SIMPLE_PROPS } from './comp';
import CompShell from './CompShell.vue';

defineProps(SIMPLE_PROPS)
defineEmits(["val", "remove", "sub-val"])
</script>

<template>
    <comp-shell class="ling-comp-text" :span="span" :showed="showed" :readonly="readonly" :required="required"
        @remove="$emit('remove')">
        {{ value || '' }}
    </comp-shell>
</template>

<style lang="less" scoped></style>
