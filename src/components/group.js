import { v4 as uuid } from "uuid"

// 五级联动结构，占满 30 列栅格（9 + 5 + 5 + 5 + 6）
const AREA_LEVELS = [
    { key: "SHENG", title: "省", placeholder: "省", span: [1, 10], optionValue: "province", parent: null },
    { key: "SHI", title: "市", placeholder: "市", span: [10, 15], optionValue: "city", parent: "SHENG" },
    { key: "XIAN", title: "县", placeholder: "区县", span: [15, 20], optionValue: "county", parent: "SHI" },
    { key: "JIANDAO", title: "街道", placeholder: "乡镇街道", span: [20, 25], optionValue: "town", parent: "XIAN" },
    { key: "CHUN", title: "村", placeholder: "村/居委会", span: [25, 31], optionValue: "ZJ-village", parent: "JIANDAO" },
]

/**
 * 生成“省 / 市 / 县 / 街道 / 村”五级联动的一组选择框
 * @param {string} prefix 各字段 label 的前缀，如 "HK" -> HK_SHENG / HK_SHI ...
 * @param {string} title 首项显示标题
 */
export function areaJSON(prefix, title = "户口地址") {
    const p = String(prefix ?? "").toUpperCase()
    return AREA_LEVELS.map((level, index) => ({
        id: uuid(),
        value: "",
        title: index === 0 ? title : level.title,
        span: `auto / ${level.span[0]} / auto / ${level.span[1]}`,
        type: "SELECT",
        showTitle: index === 0 ? "1" : "0",
        paged: "0",
        multipled: "0",
        optionValue: level.optionValue,
        label: `${p}_${level.key}`,
        placeholder: level.placeholder,
        // 省级是联动链起点、没有 func，必须参与批量字典加载，否则选项为空；
        // 下级靠 func 触发联动加载，不参与批量加载
        unAutoLoad: index === 0 ? "0" : "1",
        ...(level.parent ? { func: `${p}_${level.parent}` } : {}),
    }))
}
