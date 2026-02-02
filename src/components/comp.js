import { v4 as uuid } from "uuid"
import { nextTick } from "vue"
import { areaJSON } from "./group"
import { cloneDeep } from "lodash-es"

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
        default: "auto / 1 / auto / 31",
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
    css: {
        type: String,
        default: "",
        desc: "样式"
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

function addTextComp(comps, cb = () => { }) {
    comps && comps?.push({
        id: uuid(),
        value: "我是一个标题",
        span: "auto / 1 / auto / 31",
        type: "TEXT",
        showTitle: "1"
    })
    nextTick(() => {
        cb()
    })
}

function addInputComp(comps, cb = () => { }) {
    comps && comps?.push({
        id: uuid(),
        value: "",
        title: "输入框",
        span: "auto / 1 / auto / 31",
        type: "INPUT",
        showTitle: "1"
    })
    nextTick(() => {
        cb()
    })
}


function addSelectComp(comps, cb = () => { }) {
    comps && comps?.push({
        id: uuid(),
        value: "",
        title: "选择框",
        span: "auto / 1 / auto / 31",
        type: "SELECT",
        showTitle: "1"
    })
    nextTick(() => {
        cb()
    })
}

function addCheckComp(comps, cb = () => { }) {
    comps && comps?.push({
        id: uuid(),
        value: "",
        title: "多选",
        span: "auto / 1 / auto / 31",
        type: "CHECK",
        showTitle: "1"
    })

    nextTick(() => {
        cb()
    })
}

function addRadioComp(comps, cb = () => { }) {
    comps && comps?.push({
        id: uuid(),
        value: "",
        title: "单选",
        span: "auto / 1 / auto / 31",
        type: "RADIO",
        showTitle: "1"
    })

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

function changeWidth(comps, cb = () => { }, comp, spanStrat, spanEnd) {
    if ("id" in comp) {
        comp.span = `auto / ${spanStrat} / auto / ${spanEnd}`
        nextTick(() => {
            cb()
        })
    }
}

export const COMP_FUN_MAP = {
    CHANGE_WIDTH_1_31: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 1, 31),
    CHANGE_WIDTH_1_16: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 1, 16),
    CHANGE_WIDTH_16_31: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 16, 31),
    CHANGE_WIDTH_1_8: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 1, 8),
    CHANGE_WIDTH_8_15: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 8, 15),
    CHANGE_WIDTH_15_22: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 15, 22),
    CHANGE_WIDTH_22_29: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 22, 29),
    CHANGE_WIDTH_1_11: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 1, 11),
    CHANGE_WIDTH_11_21: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 11, 21),
    CHANGE_WIDTH_21_31: (comps, cb = () => { }, comp) => changeWidth(comps, cb, comp, 21, 31),
    COPY_COMPONENT: copyComponent,
    ADD_TEXT: addTextComp,
    ADD_INPUT: addInputComp,
    ADD_SELECT: addSelectComp,
    ADD_CHECK: addCheckComp,
    ADD_RADIO: addRadioComp,
    ADD_AREA: addAreaComp,
    ADD_SELECT2: () => { },
}
