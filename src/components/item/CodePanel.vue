<script setup>
defineProps({
  code: String,
});

const emit = defineEmits(["val"]);
</script>

<template>
  <textarea id="codepanel" :value="code" @change="e => emit('val', e.target.value)"></textarea>
</template>

<style lang="less">
#codepanel {
  box-sizing: border-box;
  width: 100%;
  height: 480px;
  position: relative;
}
</style>
