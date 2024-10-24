/**
 * 定义所有任务类型的枚举，包括促活留存、商业收入、分享拉新、游戏相关和日月签到任务
 * @typedef {Object} AllTasks
 * @property {Object} CumulativeCheckInDays - 累计签到任务
 * @property {Object} CumulativeLoginDays - 累计登录活动任务
 * @property {Object} DailyBrowseCircle - 每日浏览圈子任务
 * @property {Object} BrowseDesignatedContent - 浏览指定内容任务
 * @property {Object} BrowseDesignatedChannel - 浏览指定频道任务
 * @property {Object} PostXDynamicInTopic - 在指定话题下发帖任务
 * @property {Object} LikeCircleXTimes - 点赞圈子任务
 * @property {Object} CompleteXComments - 完成评论任务
 * @property {Object} ShareCircleXTimes - 分享圈子任务
 * @property {Object} SpeakInChannel - 在指定频道发言任务
 * @property {Object} CompleteXAnswers - 完成问答任务
 * @property {Object} CompleteXPointTasks - 完成积分任务
 * @property {Object} DailyBrowseMall - 浏览商城任务
 * @property {Object} CompleteOnePurchase - 完成商城购买任务
 * @property {Object} MallPaymentReachesX - 商城付费金额达标任务
 * @property {Object} PurchaseSpecificProduct - 购买特定商品任务
 * @property {Object} MallPaymentXTimes - 商城多次付费任务
 * @property {Object} DailyShareActivity - 每日分享活动任务
 * @property {Object} InviteNewUsers - 邀请新用户任务
 * @property {Object} LoginGameFromFanbook - 从Fanbook登录游戏任务
 * @property {Object} PlayGameCore - 玩游戏核心玩法任务
 * @property {Object} DailySign - 日签任务
 * @property {Object} MonthlySign - 月签任务
 * @description 这个枚举定义了所有可能的任务类型，包括各种促活、留存、商业和游戏相关的任务。每个任务都有其特定的属性，如名称、值、描述等。
 * @example
 * // 使用示例
 * const checkInTask = AllTasks.CumulativeCheckInDays;
 * console.log(checkInTask.name); // 输出: '累计签到%天'
 * console.log(checkInTask.value); // 输出: 3
 */
const AllTasks = {
    // 促活留存任务
    /** @property {Object} CumulativeCheckInDays - 累计签到%天 */
    CumulativeCheckInDays: { name: '累计签到%s天', value: 3, desc: '累计签到的类型配置', key: 'CumulativeCheckInDays', channel: 'integral', task_event: 'task_integral_sign_in', type: 'ActivateAndRetain' },
    /** @property {Object} CumulativeLoginDays - 累计登录活动%天 */
    CumulativeLoginDays: { name: '累计登录活动%s天', value: 4, desc: '用户在活动期间内累计登录活动页面指定天数', key: 'CumulativeLoginDays', channel: 'fb', task_event: 'task_fb_activity_login', type: 'ActivateAndRetain' },
    /** @property {Object} DailyBrowseCircle - 每日浏览圈子 */
    DailyBrowseCircle: { name: '每日浏览圈子', value: 5, desc: '该用户在活动期间内登录过1次活动页面，且当天浏览过该动态，则算完成。', key: 'DailyBrowseCircle', channel: 'fb', task_event: 'task_fb_circle_view', type: 'ActivateAndRetain' },
    /** @property {Object} BrowseDesignatedContent - 浏览指定的内容 */
    BrowseDesignatedContent: { name: '浏览指定的内容', value: 6, desc: '用户浏览指定的内容页面', key: 'BrowseDesignatedContent', channel: 'fb', task_event: 'task_fb_circlepost_view', type: 'ActivateAndRetain' },
    /** @property {Object} BrowseDesignatedChannel - 浏览指定的频道 */
    BrowseDesignatedChannel: { name: '浏览指定的频道', value: 7, desc: '用户浏览指定的频道页面', key: 'BrowseDesignatedChannel', channel: 'fb', task_event: 'task_fb_channel_view', type: 'ActivateAndRetain' },
    /** @property {Object} PostXDynamicInTopic - 到指定的圈子话题下发帖 */
    PostXDynamicInTopic: { name: '到指定的圈子话题下发帖', value: 8, desc: '用户在指定话题下发布指定数量的动态', key: 'PostXDynamicInTopic', channel: 'fb', task_event: 'task_fb_tag_post', type: 'ActivateAndRetain' },
    /** @property {Object} LikeCircleXTimes - 点赞圈子%s次 */
    LikeCircleXTimes: { name: '点赞圈子%s次', value: 19, desc: '用户在活动期间内点赞圈子指定次数', key: 'LikeCircleXTimes', channel: 'fb', task_event: 'task_fb_circle_like', type: 'ActivateAndRetain' },
    /** @property {Object} CompleteXComments - 完成%s次评论 */
    CompleteXComments: { name: '完成%s次评论', value: 18, desc: '用户在活动期间内完成指定次数的评论', key: 'CompleteXComments', channel: 'fb', task_event: 'task_fb_circle_comment', type: 'ActivateAndRetain' },
    /** @property {Object} ShareCircleXTimes - 每日分享圈子 */
    ShareCircleXTimes: { name: '每日分享圈子', value: 20, desc: '用户每天分享圈子', key: 'ShareCircleXTimes', channel: 'fb', task_event: 'task_fb_circle_share', type: 'ActivateAndRetain' },
    /** @property {Object} SpeakInChannel - 到指定的频道下发言 */
    SpeakInChannel: { name: '到指定的频道下发言', value: 10, desc: '用户在指定频道发言', key: 'SpeakInChannel', channel: 'fb', task_event: 'task_fb_channel_chat', type: 'ActivateAndRetain' },
    /** @property {Object} CompleteXAnswers - 完成%s次回答 */
    CompleteXAnswers: { name: '完成%s次回答', value: 11, desc: '用户在活动期间内完成指定次数的回答', key: 'CompleteXAnswers', channel: 'fb', task_event: 'task_fb_question_answer', type: 'ActivateAndRetain' },
    /** @property {Object} CompleteXPointTasks - 完成x个积分任务 */
    CompleteXPointTasks: { name: '完成x个积分任务', value: 12, desc: '用户在活动期间内完成指定数量的积分任务', key: 'CompleteXPointTasks', channel: 'integral', task_event: 'task_integral_complete', type: 'ActivateAndRetain' },

    // 商业收入任务
    /** @property {Object} DailyBrowseMall - 浏览商城 */
    DailyBrowseMall: { name: '浏览商城', value: 12, desc: '用户浏览商城', key: 'DailyBrowseMall', channel: 'mall', task_event: 'task_mall_view_number', type: 'BusinessRevenue' },
    /** @property {Object} CompleteOnePurchase - 在商城完成1次购买 */
    CompleteOnePurchase: { name: '在商城完成1次购买', value: 13, desc: '用户在商城完成一次购买', key: 'CompleteOnePurchase', channel: 'mall', task_event: 'task_mall_order_number', type: 'BusinessRevenue' },
    /** @property {Object} MallPaymentReachesX - 在商城付费金额达到 */
    MallPaymentReachesX: { name: '在商城付费金额达到', value: 14, desc: '用户在商城付费金额达到指定数额', key: 'MallPaymentReachesX', channel: 'mall', task_event: 'task_mall_order_amount', type: 'BusinessRevenue' },
    /** @property {Object} PurchaseSpecificProduct - 在商城购买某种特定商品 */
    PurchaseSpecificProduct: { name: '在商城购买某种特定商品', value: 15, desc: '用户在商城购买指定的特定商品', key: 'PurchaseSpecificProduct', channel: 'mall', task_event: 'task_mall_order_product', type: 'BusinessRevenue' },
    /** @property {Object} MallPaymentXTimes - 商城付费x次 */
    MallPaymentXTimes: { name: '商城付费x次', value: 18, desc: '用户在商城付费指定次数', key: 'MallPaymentXTimes', channel: 'mall', task_event: 'task_mall_order_times', type: 'BusinessRevenue' },

    // 分享拉新任务
    /** @property {Object} DailyShareActivity - 每日分享活动 */
    DailyShareActivity: { name: '每日分享活动', value: 1, desc: '用户每天分享活动页面', key: 'DailyShareActivity', channel: 'fb', task_event: 'task_fb_activity_share', type: 'ShareAndAcquire' },
    /** @property {Object} InviteNewUsers - 邀请%s位好友 */
    InviteNewUsers: { name: '邀请%s位好友', value: 2, desc: '邀请指定数量的好友', key: 'InviteNewUsers', channel: 'fb', task_event: 'task_fb_invite_join', type: 'ShareAndAcquire' },

    // 游戏相关任务
    /** @property {Object} LoginGameFromFanbook - 从Fanbook登陆1次游戏 */
    LoginGameFromFanbook: { name: '从Fanbook登陆1次游戏', value: 16, desc: '用户从Fanbook登录游戏一次', key: 'LoginGameFromFanbook', channel: 'game', task_event: 'task_game_login_fblogin', type: 'GameRelated' },
    /** @property {Object} PlayGameCore - 玩1局游戏核心玩法 */
    PlayGameCore: { name: '玩1局游戏核心玩法', value: 17, desc: '用户玩一局游戏的核心玩法', key: 'PlayGameCore', channel: 'game', task_event: 'task_game_play_passing', type: 'GameRelated' },

    // 日签和月签任务
    /** @property {Object} DailySign - 日签 */
    DailySign: { name: '日签', value: 19, desc: '用户完成每日签到', key: 'DailySign', channel: 'integral', task_event: 'task_integral_daily_sign', type: 'DailyMonthlySign' },
    /** @property {Object} MonthlySign - 月签 */
    MonthlySign: { name: '月签', value: 20, desc: '用户完成每月签到', key: 'MonthlySign', channel: 'integral', task_event: 'task_integral_monthly_sign', type: 'DailyMonthlySign' },
};

export { AllTasks };

export { TaskCount, TaskRewardCount } from './counter';
export { DailyMonthlySignTasks } from './dailyMonthlySignTasks';
export { MarketingStrategy } from './marketingStrategy';
export { TimeInterval } from './time';

