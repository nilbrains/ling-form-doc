const DICTS = {
    default: [
        { label: "默认选择", value: "001" },
        { label: "测试选择", value: "002" },
    ]
}

export function getDictVal(key = 'default') {
    return DICTS[key] || [];
}

