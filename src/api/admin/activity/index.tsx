import http from '@/utils/http'
import { getGuildId } from '@/utils/storage'
import type { GuildData } from '../guild'
export * from './create'
export * from './lock'
export * from './lottery-gift'
export * from './upload'
/**
 * 活动列表数据接口
 */
export interface ActivityListItemData {
  activity_id: number // 活动ID
  name: string // 活动名称
  start_time: string // 活动开始时间
  end_time: string // 活动结束时间
  logo_url: string // 活动Logo URL
  template_type: string // 活动模板类型
  status: number // 活动状态
  header_img: string // 活动头部图片
  draw_img: string // 活动抽奖图片
  draw_button_txt: string // 活动抽奖按钮文本
  task_img: string // 活动任务图片
  task_number: number // 活动任务数量
  guild_id: number // 社区ID
  game_binding_status: number // 游戏绑定状态
  game_binding_url: string // 游戏绑定URL
  game_id: number // 游戏ID
  game_id_ios: number // iOS游戏ID
  mall_id: number // 商城ID
  rule: null // 活动规则
  share_data: null // 分享数据
  updated_by: string // 更新者
  lock_time: number // 锁定时间
  created_by: string // 创建者
  extra_data: null // 额外数据
  created_at: number // 创建时间
  updated_at: number // 更新时间
  online_at: number // 上线时间
  bgcolor: null // 背景颜色
  deleted_at: string // 删除时间
  priority: null // 优先级
  bg_img: string // 背景图片
  more_title: null // 更多标题
  more_activity: null // 更多活动
  lock: boolean // 是否锁定
  lock_user_id: string // 锁定用户ID
  nickname: string // 编辑中的用户昵称
  start_end_time: [string, string] // 自定义字段【前端交互】
}

export interface ActivityList {
  lists: ActivityListItemData[]
  total: number
}

/**
 * 获取活动列表
 * @param guild_id - 社区ID（可选，如果未提供则使用 getGuildId 获取）
 * @param params - 查询参数对象
 * @param params.page - 页数
 * @param params.activity_id - 活动ID
 * @param params.name - 活动名称
 * @param params.status - 活动状态
 * @param params.start_time - 活动开始时间
 * @param params.end_time - 活动结束时间
 * @returns 返回活动列表数据
 */
export function getActivityList(
  guild_id: GuildData['guild_id'] | undefined = undefined,
  params: {
    page?: number
    activity_id?: string
    name?: string
    status?: number
    start_time?: string
    end_time?: string
  } = {}
) {
  const guildId = guild_id ?? getGuildId() ?? ''

  return http<ActivityList>({
    url: `/admin/activity/list/${guildId}`,
    method: 'get',
    params,
  })
}

/**
 * 删除活动
 * @param activity_id - 活动ID
 * @param guild_id - 社区ID（可选，如果未提供则使用 getGuildId 获取）
 * @returns 返回删除操作的结果
 */
export function deleteActivityListItem({
  activity_id,
  guild_id,
}: {
  activity_id: ActivityListItemData['activity_id']
  guild_id?: GuildData['guild_id']
}) {
  const guildId = guild_id ?? getGuildId() ?? ''

  return http({
    url: `/admin/activity/${guildId}/${activity_id}`,
    method: 'delete',
  })
}

/**
 * 下线活动
 * @param activity_id - 活动ID
 * @param guild_id - 社区ID（可选，如果未提供则使用 getGuildId 获取）
 * @returns 返回下线操作的结果
 */
export function offlineActivityListItem({
  activity_id,
  guild_id,
}: {
  activity_id: ActivityListItemData['activity_id']
  guild_id?: GuildData['guild_id']
}) {
  const guildId = guild_id ?? getGuildId() ?? ''

  return http<Pick<ActivityListItemData, 'activity_id'>>({
    url: `/admin/activity/offline/${guildId}/${activity_id}`,
    method: 'put',
  })
}

/**
 * 上线活动
 * @param activity_id - 活动ID
 * @param guild_id - 社区ID（可选，如果未提供则使用 getGuildId 获取）
 * @returns 返回上线操作的结果
 */
export function onlineActivityListItem({
  activity_id,
  guild_id,
}: {
  activity_id: ActivityListItemData['activity_id']
  guild_id?: GuildData['guild_id']
}) {
  const guildId = guild_id ?? getGuildId() ?? ''

  return http<Pick<ActivityListItemData, 'activity_id'>>({
    url: `/admin/activity/online/${guildId}/${activity_id}`,
    method: 'put',
  })
}

/**
 * 白名单列表项数据接口
 */
export interface ActivityWhiteListItemData {
  id: number // 白名单项ID
  user_id: number // 用户ID
  activity_id: number // 活动ID
  created_at: number // 创建时间
  nickname: string // 用户昵称
}

/**
 * 获取白名单列表
 *
 * 该函数用于获取指定活动和社区的白名单列表。
 *
 * @param {Object} params - 参数对象
 * @param {number} params.activity_id - 活动ID
 * @param {number} params.guild_id - 社区ID（可选，如果未提供则使用 getGuildId 获取）
 * @returns {Promise<ActivityWhiteListItemData[]>} 返回白名单列表数据
 */
export function getActivityWhiteList({
  activity_id,
  guild_id,
}: {
  activity_id: ActivityListItemData['activity_id']
  guild_id?: GuildData['guild_id']
}) {
  const guildId = guild_id ?? getGuildId() ?? ''

  return http<ActivityWhiteListItemData[]>({
    url: `/admin/activity/white/${guildId}/${activity_id}`,
    method: 'get',
  })
}

/**
 * 添加白名单
 *
 * 该函数用于向指定活动和社区添加白名单。
 *
 * @param {Object} params - 参数对象
 * @param {number} params.activity_id - 活动ID
 * @param {number} params.guild_id - 社区ID（可选，如果未提供则使用 getGuildId 获取）
 * @param {Object} params.params - 请求参数
 * @param {number[]} params.params.members - 用户ID数组
 * @param {number} params.params.activity_id - 活动ID
 * @returns {Promise<Pick<ActivityListItemData, 'activity_id'>>} 返回添加白名单操作的结果
 */
export function addActivityWhiteList({
  activity_id,
  guild_id,
  params,
}: {
  activity_id: ActivityListItemData['activity_id']
  guild_id?: GuildData['guild_id']
  params: {
    members: number[]
    activity_id: number
  }
}) {
  const guildId = guild_id ?? getGuildId() ?? ''

  return http<Pick<ActivityListItemData, 'activity_id'>>({
    url: `/admin/activity/white/${guildId}/${activity_id}`,
    method: 'post',
    data: params,
  })
}

/**
 * 追加兑换码参数接口
 */
export interface AddCdKeyParams {
  /** CSV文件的URL */
  file_url: string
  /** 礼包配置ID */
  draw_gift_id: number
  /** 奖励ID */
  prize_id: number
  /** 活动 ID */
  activity_id: number
}

/**
 * 追加兑换码响应接口
 */
interface AddCdKeyResponse {
  /** 消息 */
  msg: string
  /** 状态码 */
  code: number
  /** 数据对象 */
  data: {
    /** 文件URL */
    url: string
    /** 文件路径 */
    file_path: string
    /** 文件名 */
    file_name: string
    /** 文件扩展名 */
    file_ext: string
    /** 文件大小 */
    file_size: number
    /** 文件行数 */
    file_row: number
  }
}

/**
 * 追加兑换码
 * @param {Object} options - 追加兑换码选项
 * @param {string} options.activity_id - 活动ID
 * @param {AddCdKeyParams} options.params - 追加兑换码参数
 * @returns {Promise<AddCdKeyResponse>} 追加兑换码响应
 */
export function addCdKey({ activity_id, params }: { activity_id: string | number; params: AddCdKeyParams }) {
  return http<AddCdKeyResponse>({
    url: `/admin/gift/${activity_id}/cdkey/add`,
    method: 'post',
    data: params,
  })
}
