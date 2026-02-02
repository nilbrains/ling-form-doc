<script setup>
import { ref, onUnmounted, onMounted } from "vue";
const model = defineProps({
  code: String,
});

const emit = defineEmits(["val"]);

onMounted(() => {
  
});

onUnmounted(() => {

})


</script>

<template>
  <textarea id="codepanel" type="textarea" :value="code" @change="e => emit('val', e.target.value)"></textarea>
</template>

<style lang="less">
#codepanel {
  box-sizing: border-box;
  width: 100%;
  height: 480px;
  position: relative;

  .codeflask {
    height: 480px;
    background-color: #282c34;

    .codeflask__textarea {
      caret-color: #fff;
    }
  }
}
</style>
