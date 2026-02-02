import { v4 as uuid } from "uuid"

export const customs = {
    TL_1: {
        title: "基础组件"
    },
    N_TEXT: {
        title: "文字",
        comp: () => ([{
            id: uuid(),
            value: "我是一个标题",
            span: "auto / 1 / auto / 31",
            type: "TEXT",
            showTitle: "1"
        }])
    },
    N_INPUT: {
        title: "输入框",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "输入框",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1"
        }])
    },
    N_DATE: {
        title: "日期框",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "日期框",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            inputType: "date",
            showTitle: "1"
        }])
    },
    N_DATETIME: {
        title: "日期时间框",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "日期时间框",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            inputType: "datetime-local",
            showTitle: "1"
        }])
    },
    N_CHECK: {
        title: "选择框",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "选择框",
            span: "auto / 1 / auto / 31",
            type: "SELECT",
            showTitle: "1"
        }])
    },
    N_RADIO: {
        title: "多选框",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "多选",
            span: "auto / 1 / auto / 31",
            type: "CHECK",
            showTitle: "1"
        }])
    },
    N_SELECT: {
        title: "单选框",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "单选",
            span: "auto / 1 / auto / 31",
            type: "RADIO",
            showTitle: "1"
        }])
    },
    TL_2: {
        title: "自定义组件"
    },
    CUS_DBT: {
        title: "标题",
        comp: () => ([{
            id: uuid(),
            value: "我是一个标题",
            title: "",
            span: "auto / 1 / auto / 31",
            type: "TEXT",
            showTitle: "1",
            label: "",
            css: 'font-size: 32px;justify-content:center;'
        }])
    },
    CUS_SFXZK: {
        title: "是否选择",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "选择",
            span: "auto / 1 / auto / 31",
            type: "SELECT",
            showTitle: "1",
            label: "",
            optionCheck: "1:是\n2:否",
        }])
    },
    CUS_MZHM: {
        title: "门诊号",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "门诊号",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "mzhm",
        }])
    },
    CUS_ZYHM: {
        title: "住院号",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "住院号",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "zyh",
        }])
    },
    CUS_SFZH: {
        title: "身份证号",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "身份证号",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "sfzh",
        }])
    },
    CUS_HZXM: {
        title: "患者姓名",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "患者姓名",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "brxm",
        }])
    },
    CUS_HZXB: {
        title: "性别",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "性别",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "brxb",
        }])
    },
    CUS_CSNY: {
        title: "出生日期",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "出生日期",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "csny",
            inputType: "date",
        }])
    },

    CUS_MZDM: {
        title: "民族",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "民族",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "vc_mz",
            inputType: "",
            paged: "1",
            multipled: "0",
            optionValue: "nation",
        }])
    },

    CUS_HKDZ: {
        title: "户口地址",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "户口地址",
            span: "auto / 1 / auto / 10",
            type: "SELECT",
            showTitle: "1",
            paged: "0",
            multipled: "0",
            optionValue: "province",
            label: "HK_SHENG",
            placeholder: "省",
            unAutoLoad: "0",
        },
        {
            id: uuid(),
            value: "",
            title: "市",
            span: "auto / 10 / auto / 15",
            type: "SELECT",
            showTitle: "0",
            paged: "0",
            multipled: "0",
            func: "HK_SHENG",
            label: "HK_SHI",
            optionValue: "city",
            placeholder: "市",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "县",
            span: "auto / 15 / auto / 20",
            type: "SELECT",
            showTitle: "0",
            paged: "0",
            multipled: "0",
            func: "HK_SHI",
            label: "HK_XIAN",
            optionValue: "county",
            placeholder: "区县",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "街道",
            span: "auto / 20 / auto / 25",
            type: "SELECT",
            showTitle: "0",
            label: "HK_JIANDAO",
            paged: "0",
            multipled: "0",
            func: "HK_XIAN",
            optionValue: "town",
            placeholder: "乡镇街道",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "村",
            span: "auto / 25 / auto / 31",
            type: "SELECT",
            showTitle: "0",
            paged: "0",
            multipled: "0",
            label: "HK_CHUN",
            func: "HK_JIANDAO",
            optionValue: "ZJ-village",
            placeholder: "村/居委会",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "户口详细地址",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "VC_HJDZXXDZ",
        }])
    },


    CUS_JZDZ: {
        title: "居住地址",
        comp: () => ([{
            id: uuid(),
            value: "",
            title: "居住地址",
            span: "auto / 1 / auto / 10",
            type: "SELECT",
            showTitle: "1",
            paged: "0",
            multipled: "0",
            optionValue: "province",
            label: "JZD_SHENG",
            placeholder: "省",
        },
        {
            id: uuid(),
            value: "",
            title: "市",
            span: "auto / 10 / auto / 15",
            type: "SELECT",
            showTitle: "0",
            paged: "0",
            multipled: "0",
            func: "JZD_SHENG",
            label: "JZD_SHI",
            optionValue: "city",
            placeholder: "市",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "县",
            span: "auto / 15 / auto / 20",
            type: "SELECT",
            showTitle: "0",
            paged: "0",
            multipled: "0",
            func: "JZD_SHI",
            label: "JZD_XIAN",
            optionValue: "county",
            placeholder: "区县",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "街道",
            span: "auto / 20 / auto / 25",
            type: "SELECT",
            showTitle: "0",
            label: "JZD_JIANDAO",
            paged: "0",
            multipled: "0",
            func: "JZD_XIAN",
            optionValue: "town",
            placeholder: "乡镇街道",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "村",
            span: "auto / 25 / auto / 31",
            type: "SELECT",
            showTitle: "0",
            paged: "0",
            multipled: "0",
            label: "JZD_CHUN",
            func: "JZD_JIANDAO",
            optionValue: "ZJ-village",
            placeholder: "村/居委会",
            unAutoLoad: "1",
        },
        {
            id: uuid(),
            value: "",
            title: "居住详细地址",
            span: "auto / 1 / auto / 31",
            type: "INPUT",
            showTitle: "1",
            label: "VC_JZDZXXDZ",
        }])
    }
}