/**
 * 定义日签和月签枚举类型，包含两个值：日签、月签
 * @typedef {Object} DailyMonthlySignTasks
 * @property {Object} DailySign - 日签任务
 * @property {string} DailySign.name - 日签任务名称
 * @property {number} DailySign.value - 日签任务值
 * @property {string} DailySign.desc - 日签任务描述
 * @property {string} DailySign.key - 日签任务键名
 * @property {Object} MonthlySign - 月签任务
 * @property {string} MonthlySign.name - 月签任务名称
 * @property {number} MonthlySign.value - 月签任务值
 * @property {string} MonthlySign.desc - 月签任务描述
 * @property {string} MonthlySign.key - 月签任务键名
 */
const DailyMonthlySignTasks = {
    /** 日签 */
    DailySign: { name: '日签', value: 0, desc: '', key: 'DailySign' },

    /** 月签 */
    MonthlySign: { name: '月签', value: 1, desc: '', key: 'MonthlySign' },
};

export { DailyMonthlySignTasks };
