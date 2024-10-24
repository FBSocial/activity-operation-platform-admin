import type { CircleChannelInfo } from "@/api/admin/activity/task";
import type { LotteryActivityTaskTypeList } from "@/contexts/GuildDataContext";

// 定义上下文数据接口
interface ContextData {
    activityUrl: string;
    activityId: string | number;
    guildId: string | null;
    circleChannels?: CircleChannelInfo | null;
    lotteryActivityTaskTypeList?: LotteryActivityTaskTypeList | null; // 根据实际类型调整
}

/**
 * 根据任务类型和表单数据生成对应的任务行为配置
 * @param formData 表单数据
 * @param contextData 上下文数据
 * @returns 任务行为配置对象
 */
export const getAction = (formData, contextData: ContextData) => {

    // 提取原始任务配置
    const originalTaskConfig = formData[formData.task_event] || {}
    console.log("%c 原始任务配置:", "color:#e41a6a", originalTaskConfig);

    const { activityId, activityUrl, guildId, circleChannels, lotteryActivityTaskTypeList } = contextData

    const circleId = circleChannels?.channel_id

    // 预设的任务配置
    const taskSetting = lotteryActivityTaskTypeList?.taskSetting
    // 接口预设的任务配置
    const taskEventSetting = taskSetting?.find(item => item.task_event === formData.task_event)


    const externalLink = `${activityUrl}?fb_redirect&open_type=mp`
    const internalLink = `${activityUrl}?fb_redirect&open_type=mp`
    // 根据任务事件类型返回对应的行为配置
    switch (formData.task_event) {
        // Fanbook 相关任务
        case 'task_fb_activity_share':
            // 每日分享活动
            return {
                taskType: 'fb',
                params: {
                    scene: 'sharemp',
                    type: 'normal',
                    bindGuild: false,
                    internalLink,
                    externalLink,
                    activityId: activityId,
                    guildId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_fb_invite_join':
            // 邀请好友
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'invite',
                    activityId: activityId,
                    guildId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_fb_circle_view':
            // 每日��览圈子
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'circle',
                    circleId,
                    guildId,
                    activityId: activityId,
                    activityUrl,
                }
            };

        case 'task_fb_circle_comment':
            // 完成评论
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'circle',
                    circleId,
                    guildId: guildId || '',
                    activityId: activityId,
                    activityUrl,
                }
            };

        case 'task_fb_circle_like':
            // 点赞圈子
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'circle',
                    circleId,
                    guildId: guildId,
                    activityId: activityId,
                    activityUrl,
                }
            };

        case 'task_fb_circle_share':
            // 每日分享圈子
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'circle',
                    circleId,
                    guildId: guildId || '',
                    activityId: activityId,
                    activityUrl,
                }
            };

        case 'task_fb_circlepost_view':
            // 浏览指定的内容
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'circlePost',
                    postId: originalTaskConfig.post_id || '',
                    activityId: activityId,
                    guildId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_fb_channel_view':
            // 浏览指定的频道
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'channel',
                    guildId: guildId || '',
                    channelId: originalTaskConfig.channel_id || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_fb_channel_chat':
            // 去频道发言
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'channel',
                    guildId: guildId || '',
                    channelId: originalTaskConfig.channel_id || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_fb_tag_post':
            // 到话题下发动态
            return {
                taskType: 'fb',
                params: {
                    scene: 'guild',
                    target: 'circle',
                    guildId: guildId || '',
                    tagId: originalTaskConfig.tag_id || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_fb_question_answer':
            // 完成回答
            return {
                taskType: 'fb',
                params: {
                    "scene": "guild",
                    "target": "channel",
                    "guildId": guildId || '',
                    "channelId": originalTaskConfig.channel_id || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };

        // 积分相关任务
        case 'task_integral_sign_in': {
            // 累计签到
            const scene = originalTaskConfig.sign_in_type === 1 ? 'guild' : 'openmp'
            return {
                taskType: 'integral',
                params: {
                    scene,
                    target: 'channel',
                    guildId: guildId || '',
                    channelId: originalTaskConfig.channel_id || '',
                    appId: originalTaskConfig.sign_url || '',
                    keepCurrent: true,
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };
        }

        // 商城相关任务
        case 'task_mall_view_number':
            // 浏览商城
            return {
                taskType: 'mall',
                params: {
                    scene: 'openmp',
                    keepCurrent: true,
                    guildId: guildId || '',
                    appId: originalTaskConfig.mall_url || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_mall_order_number':
            // 在商城完成购买
            return {
                taskType: 'mall',
                params: {
                    scene: 'openmp',
                    keepCurrent: true,
                    guildId: guildId || '',
                    appId: originalTaskConfig.mall_url || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_mall_order_amount':
            // 在商城付费金额达到
            return {
                taskType: 'mall',
                params: {
                    scene: 'openmp',
                    keepCurrent: true,
                    guildId: guildId || '',
                    appId: originalTaskConfig.mall_url || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_mall_order_product':
            // 在商城购买某种特定商品
            return {
                taskType: 'mall',
                params: {
                    scene: 'openmp',
                    keepCurrent: true,
                    guildId: guildId || '',
                    appId: originalTaskConfig.appId || '',
                    activityId: activityId,
                    circleId,
                    activityUrl,
                }
            };


        case 'task_integral_task_done':
            // 积分商城任务
            return {
                taskType: 'integral',
                params: {
                    scene: 'openmp',
                    keepCurrent: true,
                    activityId: activityId,
                    appId: originalTaskConfig.mall_url || '',
                    guildId,
                    channelId: originalTaskConfig.channel_id || '',
                    circleId,
                    activityUrl,
                }
            };

        // 游戏相关任务
        case 'task_game_login_fblogin':
            // 从Fanbook登陆游戏
            return {
                taskType: 'game',
                params: {
                    activityId: activityId,
                    guildId,
                    circleId,
                    activityUrl,
                }
            };

        case 'task_game_play_passing':
            // 玩游戏核心玩法
            return {
                taskType: 'game',
                params: {
                    activityId: activityId,
                    guildId,
                    circleId,
                    activityUrl,
                }
            };

        // 默认情况
        default:
            return {
                taskType: taskEventSetting?.channel || '',
                params: {
                    activityId: activityId,
                    guildId,
                    circleId,
                    activityUrl,
                }
            };
    }
}
