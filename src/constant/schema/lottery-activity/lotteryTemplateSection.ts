export const LotteryTemplateSection = {
    /** 基础信息 */
    BasicInfo: { name: '基础信息', value: 'section_basicInfo', desc: '填写抽奖活动的基础信息', key: 'BasicInfo' },

    /** 背景图区 */
    BgStyle: { name: '背景图区', value: 'section_bgStyle', desc: '配置抽奖活动的背景样式', key: 'BgStyle' },

    /** 绑定账号 */
    BindAccount: { name: '绑定账号', value: 'section_bindAccount', desc: '绑定用户账号信息', key: 'BindAccount' },

    /** 抽奖奖品配置 */
    LotteryPrizeConf: { name: '抽奖奖品配置', value: 'section_lotteryPrizeConf', desc: '配置抽奖活动的奖品信息', key: 'LotteryPrizeConf' },

    /** 更多活动配置 */
    MoreActivity: { name: '更多活动配置', value: 'section_moreActivity', desc: '配置更多与活动相关的信息', key: 'MoreActivity' },

    /** 任务信息 */
    TaskInfo: { name: '任务信息', value: 'section_taskInfo', desc: '配置与任务相关的信息', key: 'TaskInfo' },
};

// 定义一个映射类型来提取 key 属性
type ExtractKey<T> = T extends { key: infer K } ? K : never;

// 使用映射类型来获取所有 key 的联合类型
export type LotteryTemplateSectionType = {
    [K in keyof typeof LotteryTemplateSection]: ExtractKey<typeof LotteryTemplateSection[K]>;
}[keyof typeof LotteryTemplateSection];
