import http from "@/utils/http";
import { getGuildId } from "@/utils/storage";
import type { GuildData } from "../guild";
import type { Gift } from "./lottery-gift";

/**
 * 创建活动参数接口
 */
export interface CreateActivityParams {
    /** 模板类型 */
    template_type: number;
    /** 活动名称 */
    name: string;
    /** 活动规则 */
    rule: string;
    /** 活动开始时间 */
    start_time: string;
    /** 活动结束时间 */
    end_time: string;
    /** 分享数据 */
    share_data: ShareData;
    /** 优先级 */
    priority: number;
    /** 背景图片 */
    bg_img: string;
    /** 游戏绑定状态 */
    game_binding_status: number;
    /** 游戏ID */
    game_id: string;
    /** 更多标题 */
    more_title: string;
    /** 更多活动 */
    more_activity: MoreActivity[];
}

/**
 * 更多活动接口
 */
interface MoreActivity {
    /** 标题 */
    title: string;
    /** 横幅 */
    banner: string;
    /** URL */
    url: string;
}

/**
 * 分享数据接口
 */
interface ShareData {
    /** 内部标题 */
    inner_title: string;
    /** 内部横幅 */
    inner_banner: string;
    /** 内部公会 */
    inner_guild: number;
    /** 外部标题 */
    outer_title: string;
    /** 外部内容 */
    outer_content: string;
    /** 外部横幅 */
    outer_banner: string;
}

/**
 * 创建活动基础信息响应接口
 */
interface CreateActivityBaseInfoResponse {
    /** 活动ID */
    activity_id: number;
    /** 活动名称 */
    name: string;
    /** 活动开始时间 */
    start_time: number;
    /** 活动结束时间 */
    end_time: number;
    /** 模板类型 */
    template_type: number;
    /** 游戏绑定状态 */
    game_binding_status: number;
    /** 游戏ID */
    game_id: string;
    /** 优先级 */
    priority: number;
    /** 背景图片 */
    bg_img: string;
    /** 更多标题 */
    more_title: string;
    /** 更多活动 */
    more_activity: string;
    /** 创建者 */
    created_by: string;
    /** 分享数据 */
    share_data: string;
    /** 活动规则 */
    rule: string;
    /** 公会ID */
    guild_id: string;
}

/**
 * 创建活动
 * @param {Object} options - 创建活动选项
 * @param {GuildData['guild_id']} [options.guild_id] - 公会ID
 * @param {CreateActivityParams} options.params - 创建活动参数
 * @returns {Promise<CreateActivityBaseInfoResponse>} 创建活动基础信息响应
 */
export function createActivity({ params, guild_id }: {
    guild_id?: GuildData['guild_id']
    params: CreateActivityParams
}) {
    const guildId = guild_id ?? getGuildId() ?? ''
    return http<CreateActivityBaseInfoResponse>({
        url: `/admin/activity/${guildId}`,
        method: 'post',
        data: params,
    })
}



export interface GetActivityDetail {
    activity_id: number;
    name: string;
    start_time: string;
    end_time: string;
    logo_url: string;
    template_type: string;
    status: number;
    header_img: string;
    draw_img: string;
    draw_button_img: string;
    task_img: string;
    task_bar_img: string;
    task_number: number;
    guild_id: number;
    game_binding_status: number;
    game_binding_url: string;
    game_id: number;
    game_id_ios: number;
    mall_id: number;
    rule: null;
    share_data: null;
    updated_by: string;
    online_at: string | null;
    lock_time: number;
    created_by: string;
    extra_data: null;
    created_at: string;
    updated_at: string;
    bgcolor: null;
    deleted_at: string;
    priority: null;
    bg_img_color: string;
    more_title: null;
    more_activity: null;
    lock_user_id: null;
    draw_num: null;
    task: Task[];
    gift: Gift[];
}



interface Task {
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
}

/**
 * 获取活动详情
 * @param {Object} options - 获取活动详情选项
 * @param {string} options.guild_id - 公会ID
 * @param {string} options.activity_id - 活动ID
 * @returns {Promise<GetActivityDetail>} 获取活动详情响应
 */
export function getActivityDetail({ guild_id, activity_id }: {
    guild_id?: string;
    activity_id: string;
}) {
    const guildId = guild_id ?? getGuildId() ?? ''
    return http<GetActivityDetail>({
        url: `/admin/activity/${guildId}/${activity_id}`,
        method: 'get',
    });
}

/**
 * 更新活动
 * @param {Object} options - 更新活动选项
 * @param {string} options.guild_id - 公会ID
 * @param {string} options.activity_id - 活动ID
 * @param {CreateActivityParams} options.params - 更新活动参数
 * @returns {Promise<CreateActivityBaseInfoResponse>} 更新活动基础信息响应
 */
export function updateActivity({ guild_id, activity_id, params }: {
    guild_id?: string;
    activity_id: number | string;
    params: CreateActivityParams;
}) {
    const guildId = guild_id ?? getGuildId() ?? ''
    return http<CreateActivityBaseInfoResponse>({
        url: `/admin/activity/${guildId}/${activity_id}`,
        method: 'post',
        data: params,
    });
}
