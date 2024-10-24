import http from "@/utils/http";
import type { GuildData } from "../guild";

/**
 * 任务设置数据接口
 */
export interface TaskSetting {
    task_setting: TaskSettingData[]
    task_setting_type: TaskSettingType[]
}



/**
 * 任务设置类型接口
 */
export interface TaskSettingType {
    /** ID */
    id: number;
    /** 类型 1:分享拉新,2:促活留存,3:商城收入,4:游戏相关 */
    name: string;
}

/**
 * 任务设置数据项接口
 */
export interface TaskSettingData {
    /** 任务ID */
    id: number;
    /** 频道 */
    channel: string;
    /** 任务简短名称 task_{模块}_{动作}_{属性} */
    task_event: string;
    /** 类型 1:分享拉新,2:促活留存,3:商城收入,4:游戏相关 */
    type: number;
    /** 任务名称 */
    name: string;
    /** 创建时间 */
    created_at: number;
    /** 更新时间 */
    updated_at: number;
    /** 任务跳转一些预设字段，json 字符串 */
    fb_jump: string;
}

/**
 * 创建任务请求参数接口
 */
interface CreateTaskParams {
    /** 活动ID */
    activity_id: number;
    /** 任务名称 */
    name: string;
    /** 任务类型 1:一次性任务 2:每天 3:每周 4:每月 */
    type: 1 | 2 | 3 | 4;
    /** 对应type是不同的时间1次/天/周/月 */
    task_refresh_time: number;
    /** 能领取次抽奖/积分 */
    reward_number: string;
    /** 条件:多少次，多少钱，多少人 */
    condition_number: number;
    /** 跳转APP动作 */
    action: string;
    /** 目标/社区ID/商城Id/游戏Id/第三方的目标Id，活动ID */
    target_id: string;
    /** 排序 */
    position: number;
    /** 任务标识 */
    task_event: string;
    /** 商城ID */
    mall_id?: string;
    /** 公会ID */
    guild_id?: string;
    /** 游戏ID */
    game_id?: number;
}

/**
 * 创建任务响应接口
 */
interface CreateTaskResponse {
    /** 活动任务ID */
    activity_task_id: number;
}

/**
 * 获取任务设置
 * @param {Object} options - 获取任务设置选项
 * @param {GuildData['guild_id']} [options.guild_id] - 公会ID
 * @returns {Promise<TaskSetting>} 任务设置数据
 */
export function getAllTaskSettings({ guild_id }: {
    guild_id?: GuildData['guild_id']
}): Promise<TaskSetting> {
    return http<TaskSetting>({
        url: `/admin/setting`,
        method: 'get',
    });
}

/**
 * 创建任务
 * @param {number|string} activity_id - 活动ID
 * @param {CreateTaskParams} params - 创建任务参数
 * @returns {Promise<CreateTaskResponse>} 创建任务响应
 */
export function createTask(activity_id: number | string, params: CreateTaskParams): Promise<CreateTaskResponse> {
    return http<CreateTaskResponse>({
        url: `/admin/task/${activity_id}/create`,
        method: 'post',
        data: params,
    });
}

/**
 * 单个任务详情接口
 */
export interface TaskDetail {
    activity_task_id: number;
    activity_id: number;
    name: string;
    task_event: string;
    type: number;
    task_refresh_time: number;
    reward_number: number;
    start_time: number;
    end_time: number;
    condition_number: number;
    status: number;
    action: string;
    target_id: string;
    game_id: number;
    guild_id: number;
    mall_id: number;
    is_once: number;
    position: number;
    created_at: number;
    updated_at: number;
    is_auto_reward: number;
    extra_data: string
}

/**
 * 保存单个任务参数接口
 */
interface SaveTaskParams {
    name?: string;
    type?: number;
    task_refresh_time?: number;
    reward_number?: string;
    condition_number?: number;
    action?: string;
    target_id?: string;
    position?: number;
}

/**
 * 任务区确定参数接口
 */
interface SaveTaskRegionParams {
    activity_id: number;
    task_array: Array<{ activity_task_id: number; position: number }>;
    task_img: string;
    task_bar_img: string;
    task_number: number;
}

/**
 * 保存单个任务
 * @param {number|string} activityId - 活动ID
 * @param {number} activityTaskId - 活动任务ID
 * @param {SaveTaskParams} params - 保存任务参数
 * @returns {Promise<void>} 保存任务响应
 */
export function saveTask(activityId: number | string, activityTaskId: number, params: SaveTaskParams): Promise<void> {
    return http({
        url: `/admin/task/${activityId}/${activityTaskId}`,
        method: 'put',
        data: params,
    });
}

/**
 * 获取单个任务详情
 * @param {number} activityId - 活动ID
 * @param {number} activityTaskId - 活动任务ID
 * @returns {Promise<TaskDetail>} 任务详情响应
 */
export function getTaskDetail(activityId: number, activityTaskId: number): Promise<TaskDetail> {
    return http<TaskDetail>({
        url: `/admin/task/${activityId}/${activityTaskId}`,
        method: 'get',
    });
}

/**
 * 获取活动下的所有任务
 * @param {number|string} activityId - 活动ID
 * @returns {Promise<TaskDetail[]>} 活动任务列表响应
 */
export function getActivityTasks(activityId: number | string): Promise<TaskDetail[]> {
    return http<TaskDetail[]>({
        url: `/admin/task/${activityId}`,
        method: 'get',
    });
}

/**
 * 保存任务区设置
 * @param {SaveTaskRegionParams} params - 保存任务区参数
 * @returns {Promise<void>} 保存任务区响应
 */
export function saveTaskRegion(params: SaveTaskRegionParams): Promise<void> {
    return http({
        url: `/admin/task/${params.activity_id}/region/save`,
        method: 'put',
        data: params,
    });
}

/**
 * 频道信息接口
 */
export interface ChannelInfo {
    /** 社区ID */
    guild_id: string;
    /** 频道ID */
    channel_id: string;
    /** 频道名称 */
    name: string;
    /** 频道类型：0 是文字频道，20 是问答频道 */
    type: 0 | 20;
}


export interface CircleChannelInfo {
    channel_id: string
    guild_id: string;
    name: string;
    parent_id: string;
    type: number
}

/**
 * 标签信息接口
 */
export interface TagInfo {
    /** 标签ID */
    tag_id: string;
    /** 标签名 */
    tag_name: string;
    /** 查看次数 */
    view_count: number;
    /** 点赞次数 */
    like_count: number;
}

/**
 * 获取社区频道列表
 * @param {string} guildId - 社区ID
 * @returns {Promise<ChannelInfo[]>} 频道列表响应
 */
export function getGuildChannels(guildId: string): Promise<{
    channel: ChannelInfo[],
    circle_channel: CircleChannelInfo,
}> {
    return http<{
        channel: ChannelInfo[],
        circle_channel: CircleChannelInfo
    }>({
        url: `/admin/guild/${guildId}/channels`,
        method: 'get',
    });
}

/**
 * 获取社区标签列表
 * @param {string} guildId - 社区ID
 * @returns {Promise<TagInfo[]>} 标签列表响应
 */
export function getGuildTags(guildId: string): Promise<TagInfo[]> {
    return http<TagInfo[]>({
        url: `/admin/guild/${guildId}/tags`,
        method: 'get',
    });
}