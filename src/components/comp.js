import { v4 as uuid } from "uuid"
import { nextTick } from "vue"
import { areaJSON } from "./group"
import { cloneDeep } from "lodash-es"
import { customs } from "./custom"

// A4 文档栅格：GRID_COLS 列对应 GRID_LINES 条网格线，
// 组件跨度写作 "auto / 起始线 / auto / 结束线"，结束线为排他边界
export const GRID_COLS = 30
export const GRID_LINES = GRID_COLS + 1

// span 形如 "auto / 1 / auto / 31"，解析出 [起始线, 结束线]
export function parseSpan(span, fallback = [1, GRID_LINES]) {
    const matched = /auto \/ (\d+) \/ auto \/ (\d+)/.exec(String(span ?? ""))
    return matched ? [+matched[1], +matched[2]] : [...fallback]
}

export function formatSpan(start, end) {
    return `auto / ${start} / auto / ${end}`
}

export const SIMPLE_PROPS = {
    id: {
        type: String,
        default: "",
        desc: "组件ID"
    },
    showed: {
        type: String,
        default: "0",
        desc: "是否显示"
    },
    label: {
        type: String,
        default: "",
        desc: "组件KEY"
    },
    showTitle: {
        type: String,
        default: "1",
        desc: "显示标题"
    },
    title: {
        type: String,
        default: "",
        desc: "组件标题"
    },
    showFooter: {
        type: String,
        default: "0",
        desc: "显示标尾"
    },
    footer: {
        type: String,
        default: "",
        desc: "组件标尾"
    },
    type: {
        type: String,
        default: "TEXT",
        desc: "组件类型"
    },
    inputType: {
        type: String,
        default: "TEXT",
        desc: "文本类型"
    },
    value: {
        type: [String, Array],
        default: "",
        desc: "组件值"
    },
    span: {
        type: String,
        default: `auto / 1 / auto / ${GRID_LINES}`,
        desc: "跨度"
    },
    css: {
        type: String,
        default: "",
        desc: "自定义样式",
    },
    unAutoLoad: {
        type: String,
        default: "",
        desc: "自动导入"
    },
    readonly: {
        type: String,
        default: "",
        desc: "只读项"
    },
    required: {
        type: String,
        default: "",
        desc: "必填项"
    },
    multipled: {
        type: String,
        default: "",
        desc: "多选"
    },
    paged: {
        type: String,
        default: "",
        desc: "分页"
    },
    optionValue: {
        type: String,
        default: "default",
        desc: "选项键值"
    },
    optionCheck: {
        type: String,
        default: "default",
        desc: "选项键值"
    },
    group: {
        type: String,
        default: "",
        desc: "分组"
    },
    fun: {
        type: String,
        default: "",
        desc: "监听函数(self)"
    },
    func: {
        type: String,
        default: "",
        desc: "监听函数(other)"
    },
    placeholder: {
        type: String,
        default: "",
        desc: "占位"
    },
    childrens: {
        type: Object,
        default: () => ({}),
        desc: "子项"
    },
}

// 右键菜单的“添加组件”复用自定义组件面板（custom.js）的模板，同一份模板不再维护两处
function addCustomComp(key, comps, cb = () => { }) {
    const factory = customs[key]?.comp
    comps && factory && comps.push(...factory())
    nextTick(() => {
        cb()
    })
}

function addAreaComp(comps, cb = () => { }) {
    ElMessageBox.prompt('请输入参数前缀', '请输入参数', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
    })
        .then(({ value }) => {
            if ((value ?? "") !== "") {
                comps && comps?.push(...areaJSON(value))
                nextTick(() => {
                    cb()
                })
            }
        })
        .catch(() => { })
}


// 解析本地选项串：每行一项，格式“值:显示名”，无冒号时显示名与值相同
export function parseOptionCheck(optionCheck) {
    return String(optionCheck ?? "")
        .split(/\r?\n/)
        .filter((it) => it !== "")
        .map((line) => {
            const [rawValue = "", rawLabel] = line.split(":");
            return {
                value: rawValue.trim(),
                label: ((rawLabel || rawValue) ?? "").trim(),
            };
        })
}

// 显示名形如 INPUT@前@子键@宽度@后 时，解析出该项内嵌的输入框
export function parseOptionInput(label) {
    if (!String(label ?? "").startsWith("INPUT")) return null
    const [, prev, name, width, next] = String(label).split("@")
    return { prev, name, width, next }
}

function copyComponent(comps, cb = () => { }, comp) {
    if ("id" in comp) {
        comp = cloneDeep(comp)
        comp.id = uuid();
        comps && comps?.push(comp)
        nextTick(() => {
            cb()
        })
    }
}

// 组件布局预设：右键菜单的展示名与跨度定义共用这一份数据
export const WIDTH_PRESETS = {
    CHANGE_WIDTH_1_31: { name: "整行", span: [1, 31] },
    CHANGE_WIDTH_1_16: { name: "二等分前", span: [1, 16] },
    CHANGE_WIDTH_16_31: { name: "二等分后", span: [16, 31] },
    CHANGE_WIDTH_1_11: { name: "三等分1", span: [1, 11] },
    CHANGE_WIDTH_11_21: { name: "三等分2", span: [11, 21] },
    CHANGE_WIDTH_21_31: { name: "三等分3", span: [21, 31] },
    CHANGE_WIDTH_1_8: { name: "四等分1", span: [1, 8] },
    CHANGE_WIDTH_8_16: { name: "四等分2", span: [8, 16] },
    CHANGE_WIDTH_16_23: { name: "四等分3", span: [16, 23] },
    CHANGE_WIDTH_23_31: { name: "四等分4", span: [23, 31] },
}

// 由预设表生成布局命令，避免十个几乎相同的处理函数重复书写
const widthCommands = Object.fromEntries(
    Object.entries(WIDTH_PRESETS).map(([key, { span: [start, end] }]) => [
        key,
        (comps, cb = () => { }, comp) => {
            if (!comp || !("id" in comp)) return
            comp.span = `auto / ${start} / auto / ${end}`
            nextTick(() => {
                cb()
            })
        },
    ]),
)

export const COMP_FUN_MAP = {
    ...widthCommands,
    COPY_COMPONENT: copyComponent,
    ADD_TEXT: (comps, cb) => addCustomComp("N_TEXT", comps, cb),
    ADD_INPUT: (comps, cb) => addCustomComp("N_INPUT", comps, cb),
    ADD_SELECT: (comps, cb) => addCustomComp("N_SELECT", comps, cb),
    ADD_CHECK: (comps, cb) => addCustomComp("N_CHECK", comps, cb),
    ADD_RADIO: (comps, cb) => addCustomComp("N_RADIO", comps, cb),
    ADD_AREA: addAreaComp,
}
