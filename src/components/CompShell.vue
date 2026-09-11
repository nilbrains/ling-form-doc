<script setup>
import { onUnmounted } from "vue";
import { SIMPLE_PROPS, GRID_COLS, GRID_LINES, parseSpan, formatSpan } from "./comp";
import IconRemove from "./icon/IconRemove.vue";

// 各组件共用的布局外壳：栅格定位、编辑态标记、删除按钮与拖动调宽
const props = defineProps({
    span: SIMPLE_PROPS.span,
    showed: SIMPLE_PROPS.showed,
    readonly: SIMPLE_PROPS.readonly,
    required: SIMPLE_PROPS.required,
});

const emit = defineEmits(["remove", "resize", "resize-end"]);

// 拖动调宽：按下时记录起始跨度与鼠标位置，移动时按位移换算列数，自动吸附到网格线
let drag = null;

// 相邻网格线的间距。内容宽 = GRID_COLS * 列宽 + (GRID_COLS - 1) * gap
function lineWidthOf(el) {
    const doc = el?.closest(".ling-doc");
    if (!doc) return 20;
    const style = getComputedStyle(doc);
    const gap = parseFloat(style.columnGap) || 0;
    const contentWidth =
        doc.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    return (contentWidth + gap) / GRID_COLS;
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function onHandleDown(edge, event) {
    event.preventDefault();
    event.stopPropagation();
    const [start, end] = parseSpan(props.span);
    drag = {
        edge,
        start,
        end,
        originX: event.clientX,
        lineWidth: lineWidthOf(event.currentTarget),
        span: props.span,
    };
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
}

function onDragMove(event) {
    if (!drag) return;
    // 始终以按下时的位置为准换算，避免逐帧累加产生偏移
    const delta = Math.round((event.clientX - drag.originX) / drag.lineWidth);
    let { start, end } = drag;
    if (drag.edge === "left") {
        start = clamp(start + delta, 1, end - 1);
    } else {
        end = clamp(end + delta, start + 1, GRID_LINES);
    }
    const span = formatSpan(start, end);
    if (span === drag.span) return;
    drag.span = span;
    emit("resize", span);
}

function onDragEnd() {
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
    if (!drag) return;
    const span = drag.span;
    drag = null;
    emit("resize-end", span);
}

onUnmounted(() => {
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
});
</script>

<template>
    <div class="ling-comp" :class="{
        readonly: readonly === '1',
        required: required === '1',
        showed: showed === '1',
    }" :style="{ 'grid-area': span }">
        <div class="remove" @click.stop="$emit('remove')">
            <icon-remove />
        </div>
        <div class="resize-handle left" @mousedown="onHandleDown('left', $event)" @click.stop></div>
        <div class="resize-handle right" @mousedown="onHandleDown('right', $event)" @click.stop></div>
        <slot />
    </div>
</template>

<style lang="less" scoped>
// 默认不渲染出手柄：填写态下 .ling-comp 是 flex 容器，空 div 会占出 gap 间距。
// 设计态选中时由 base.less 里优先级更高的规则改为 display: block
.resize-handle {
  display: none;
}
</style>
