interface Item {
    oldIndex: number;
    newIndex: number;
    position: string | number | any[]; // position 可以是 string、number 或数组
    // 其他字段...
}

interface SwapConfig<T> {
    oldIndex: number;
    newIndex: number;
    fieldsToSwap?: (keyof T)[]; // 可选的字段列表
}

/**
 * 交换数组中两个元素的位置，并指定部分字段的数值对调。
 *
 * @param items - 要操作的数组
 * @param config - 配置对象，包含要交换的元素的旧索引和新索引，以及要对调的字段列表
 */
export function swapListItem<T extends object>(rawItems: T[], config: SwapConfig<T>) {
    const { oldIndex, newIndex, fieldsToSwap = [] } = config;

    // 检查索引是否有效
    if (oldIndex < 0 || oldIndex >= rawItems.length || newIndex < 0 || newIndex >= rawItems.length) {
        throw new Error('索引超出数组范围');
    }

    // 创建一个新的数组，深拷贝原始数组
    const items = rawItems.map(item => item);

    // 交换数组中的元素
    [items[oldIndex], items[newIndex]] = [items[newIndex], items[oldIndex]];

    // 如果 fieldsToSwap 不为空，对调指定字段的数值
    if (Array.isArray(fieldsToSwap) && fieldsToSwap.length > 0) {
        for (const field of fieldsToSwap) {
            try {
                // 检查两个元素是否都具有该字段
                if (field in items[oldIndex] && field in items[newIndex]) {
                    // 对调字段值
                    [items[oldIndex][field], items[newIndex][field]] = [items[newIndex][field], items[oldIndex][field]];
                } else {
                    throw new Error(`字段 "${field as string}" 在一个或两个元素中不存在`);
                }
            } catch (error) {
                throw new Error(`处理字段 "${field as string}" 时出错: ${error}`);
            }
        }
    }

    return items;
}


/**
 * 将枚举对象的 name 映射为 label，并返回一个包含 label 和 value 的对象数组
 * @param enumObj 枚举对象
 * @returns 包含 label 和 value 的对象数组
 */
export function mapEnumToLabelValue(enumObj: { [key: string]: { name: string; value: number } }): { label: string; value: number }[] {
    return Object.keys(enumObj).map(key => ({
        label: enumObj[key].name,
        value: enumObj[key].value,
    }));
}


/**
 * 将枚举对象的 name 映射为 label，并将 name 作为 value，返回一个包含 label 和 value 的对象数组
 * @param enumObj 枚举对象
 * @returns 包含 label 和 value 的对象数组
 */
export function mapEnumToLabelValueWithNameAsValue(enumObj: { [key: string]: { name: string; value: number } }): { label: string; value: string }[] {
    return Object.keys(enumObj).map(key => ({
        label: enumObj[key].name,
        value: enumObj[key].name, // 使用 name 作为 value
    }));
}


/**
 * 过滤包含某个值或多个值的枚举项，并根据配置进行映射处理
 * @param enumObj 枚举对象
 * @param options 配置选项，包括过滤值数组、映射标签字段和映射值字段
 * @returns 包含 label 和 value 的对象数组
 */
export function filterAndMapEnum<T extends { [K in keyof T]: string | number }>(
    enumObj: { [key: string]: T },
    options: FilterMapEnumOptions<T> = {}
): { label: string | number; value: string | number }[] {
    const { filterValues = [], mapLabel = 'name' as keyof T, mapValue = 'value' as keyof T } = options;

    // 如果没有过滤值或者过滤值数组为空，则直接进行映射
    if (!filterValues || filterValues.length === 0) {
        return Object.keys(enumObj).map(key => ({
            label: enumObj[key][mapLabel],
            value: enumObj[key][mapValue],
        }));
    }

    // 使用过滤值过滤枚举项，并进行映射
    return Object.keys(enumObj)
        .filter(key => {
            const value = enumObj[key][mapValue];
            return typeof value === 'number' && !filterValues.includes(value);
        })
        .map(key => ({
            label: enumObj[key][mapLabel],
            value: enumObj[key][mapValue],
        }));
}

// 配置选项接口
interface FilterMapEnumOptions<T> {
    filterValues?: number[];
    mapLabel?: keyof T;
    mapValue?: keyof T;
}



/**
 * 移动数组中的元素
 * @param array 原数组
 * @param fromIndex 要移动的元素的起始索引
 * @param toIndex 要移动到的目标索引
 * @returns 新的数组，原数组中的元素已经被移动
 */
export function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (fromIndex === toIndex) {
        return array;
    }

    const newArray = [...array];

    if (fromIndex < toIndex) {
        // 向后移动
        for (let i = fromIndex; i < toIndex; i++) {
            [newArray[i], newArray[i + 1]] = [newArray[i + 1], newArray[i]];
        }
    } else {
        // 向前移动
        for (let i = fromIndex; i > toIndex; i--) {
            [newArray[i], newArray[i - 1]] = [newArray[i - 1], newArray[i]];
        }
    }

    return newArray;
}


/**
 * 获取数组中指定属性的最大值
 * @param arr 要处理的数组
 * @param key 要比较的属性名
 * @returns 指定属性的最大值
 */
export function getMaxPropertyValue<T>(arr: T[], key: keyof T): number {
    if (!Array.isArray(arr) || arr.length === 0) {
        return 0;
    }
    const validValues = arr.map(item => {
        const value = item[key];
        return typeof value === 'number' ? value : Number(value) || 0;
    });
    return Math.max(...validValues);
}

/**
 * 根据指定属性重新排序数组
 * @param arr 要重新排序的数组
 * @param key 用于排序的属性名
 * @param isDescending 是否降序排列，默认为 true
 * @returns 重新排序后的新数组
 */
export function reorderArrayByProperty<T>(arr: T[], key: keyof T, isDescending: boolean = true): T[] {
    if (!Array.isArray(arr) || arr.length === 0) {
        return [];
    }

    const sortedArr = [...arr].sort((a, b) => {
        const aValue = typeof a[key] === 'number' ? a[key] as number : Number(a[key]) || 0;
        const bValue = typeof b[key] === 'number' ? b[key] as number : Number(b[key]) || 0;
        return isDescending ? bValue - aValue : aValue - bValue;
    });

    return sortedArr.map((item, index) => ({
        ...item,
        [key]: isDescending ? arr.length - index : index + 1,
    }));
}


