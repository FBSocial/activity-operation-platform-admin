
/**
 * 定义时间枚举类型，包含多个值：每天、每2天、每3天、每7天、每14天、每30天
 * @typedef {Object} TimeInterval
 * @property {Object} Daily - 每天
 * @property {Object} EveryTwoDays - 每2天
 * @property {Object} EveryThreeDays - 每3天
 * @property {Object} EverySevenDays - 每7天
 * @property {Object} EveryFourteenDays - 每14天
 * @property {Object} EveryThirtyDays - 每30天
 */
const TimeInterval = {
    /**
     * 每天
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    Daily: { label: '每天', value: 1, key: 'Daily', name: '每天' },

    /**
     * 每2天
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    EveryTwoDays: { label: '每2天', value: 2, key: 'EveryTwoDays', name: '每2天' },

    /**
     * 每3天
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    EveryThreeDays: { label: '每3天', value: 3, key: 'EveryThreeDays', name: '每3天' },

    /**
     * 每7天
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    EverySevenDays: { label: '每7天', value: 7, key: 'EverySevenDays', name: '每7天' },

    /**
     * 每14天
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    EveryFourteenDays: { label: '每14天', value: 14, key: 'EveryFourteenDays', name: '每14天' },

    /**
     * 每30天
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    EveryThirtyDays: { label: '每30天', value: 30, key: 'EveryThirtyDays', name: '每30天' },
};

export { TimeInterval };


// 任务类型 1:一次性任务 2:每天 3:每周，4:每月
/**
 * 任务类型枚举
 * @enum {Object}
 */
export const TaskTimeType = {
    /**
     * 一次性任务
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    OneTime: { label: '一次性任务', value: 1, key: 'OneTime', name: '一次性任务' },

    /**
     * 每天任务
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    Daily: { label: '每日型', value: 2, key: 'Daily', name: '每日型' },

    /**
     * 每周任务
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    // Weekly: { label: '每周型', value: 3, key: 'Weekly', name: '每周型' },

    /**
     * 每月任务
     * @type {Object}
     * @property {string} label - 显示标签
     * @property {number} value - 数值
     * @property {string} key - 键名
     * @property {string} name - 名称
     */
    // Monthly: { label: '每月', value: 4, key: 'Monthly', name: '每月' },
};
