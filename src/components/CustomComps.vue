<script setup>
import { customs } from "./custom";
import { useComponentsStore } from "@/store/comps";

const componentStore = useComponentsStore();

function clickit(item) {
  componentStore.push(...customs[item]?.comp())
}

</script>

<template>
  <el-scrollbar height="100vh">
    <div class="comp-box">
      <template v-for="(item, index) in Object.keys(customs)" :key="index">
        <h4 v-if="item.indexOf('TL_') >= 0" style="grid-area: auto / 1 / auto / 3;">{{ customs[item]?.title }}</h4>
        <div v-else class="item" @click.stop="() => clickit(item)">{{ customs[item]?.title }}</div>
      </template>
    </div>
  </el-scrollbar>
</template>


<style lang="less" scoped>
.comp-box {
  padding: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 6px;
  grid-row-gap: 6px;

  .item {
    grid-area: auto;
    box-shadow: var(--el-box-shadow-lighter);
    padding: 6px 0;
    text-align: center;
    cursor: pointer;
  }
}
</style>
