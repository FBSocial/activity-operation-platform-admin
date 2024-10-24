import {
  getAllTaskSettings,
  getGuildChannels,
  getGuildTags,
  type ChannelInfo,
  type CircleChannelInfo,
  type TagInfo,
  type TaskSettingData,
  type TaskSettingType,
} from '@/api/admin/activity/task'
import { groupBy } from 'es-toolkit'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export interface LotteryActivityTaskTypeList {
  taskSetting: TaskSettingData[]
  taskSettingType: TaskSettingType[]
  groupByTaskType: Record<number, TaskSettingData[]>
  groupByTaskTypeRoot: TaskSettingData[]
}

interface GuildDataContextType {
  channels: ChannelInfo[]
  textChannels: ChannelInfo[]
  questionChannels: ChannelInfo[]
  circleChannels: CircleChannelInfo | null
  tags: TagInfo[]
  lotteryActivityTaskTypeList: LotteryActivityTaskTypeList | null
  loading: boolean
  error: string | null
  fetchGuildData: (guildId: string) => Promise<void>
}

/**
 * 创建公会数据上下文
 */
const GuildDataContext = createContext<GuildDataContextType | undefined>(undefined)

/**
 * 公会数据提供者组件
 * @param children - 子组件
 */
export function GuildDataProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<ChannelInfo[]>([])
  const [textChannels, setTextChannels] = useState<ChannelInfo[]>([])
  const [questionChannels, setQuestionChannels] = useState<ChannelInfo[]>([])
  const [circleChannels, setCircleChannels] = useState<CircleChannelInfo | null>(null)
  const [tags, setTags] = useState<TagInfo[]>([])
  const [lotteryActivityTaskTypeList, setLotteryActivityTaskTypeList] = useState<LotteryActivityTaskTypeList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * 获取公会数据
   * @param guildId - 公会ID
   */
  const fetchGuildData = useCallback(async (guildId: string) => {
    setLoading(true)
    setError(null)
    try {
      const [channelsData, tagsData, taskData] = await Promise.all([getGuildChannels(guildId), getGuildTags(guildId), getAllTaskSettings({})])

      // 处理频道数据
      const { channel: allChannels, circle_channel: circleChannels = null } = channelsData
      const categorizedChannels = categorizeChannels(allChannels)

      setChannels(allChannels)
      setTextChannels(categorizedChannels.textChannels)
      setQuestionChannels(categorizedChannels.questionChannels)
      setCircleChannels(circleChannels)
      setTags(tagsData)

      // 处理任务设置数据
      const processedTaskData = processTaskData(taskData)
      setLotteryActivityTaskTypeList(processedTaskData)
    } catch (err) {
      setError('获取公会数据失败')
      console.error('获取公会数据时发生错误:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <GuildDataContext.Provider
      value={{
        channels,
        textChannels,
        questionChannels,
        circleChannels,
        tags,
        lotteryActivityTaskTypeList,
        loading,
        error,
        fetchGuildData,
      }}
    >
      {children}
    </GuildDataContext.Provider>
  )
}

export function useGuildData() {
  const context = useContext(GuildDataContext)
  if (context === undefined) {
    throw new Error('useGuildData 必须在 GuildDataProvider 内部使用')
  }
  return context
}

/**
 * 将频道按类型分类
 * @param channels - 所有频道信息
 * @returns 分类后的频道对象
 */
function categorizeChannels(channels: ChannelInfo[]) {
  return {
    textChannels: channels.filter(item => item.type === 0),
    questionChannels: channels.filter(item => item.type === 20),
    audioChannels: channels.filter(item => item.type !== 0 && item.type !== 20),
  }
}

/**
 * 处理任务设置数据
 * @param taskData - 原始任务数据
 * @returns 处理后的任务数据
 */
function processTaskData(taskData: any): LotteryActivityTaskTypeList {
  const taskSetting = taskData.task_setting.map((item: any) => ({
    ...item,
    fb_jump: tryParseJSON(item.fb_jump),
  }))

  const filterTaskEvent = [
    'task_game_login_fblogin',
    'task_game_play_passing',
    'task_mall_order_number',
    'task_mall_order_amount',
    'task_mall_order_product',
    'task_integral_task_done',
  ]
  const filterTaskSetting = taskSetting.filter((item: TaskSettingData) => !filterTaskEvent.includes(item.task_event))
  const groupByTaskType = groupBy(filterTaskSetting, (item: TaskSettingData) => item.type)
  const groupByTaskTypeRoot = groupByTaskType[1] || []

  const taskSettingType = taskData.task_setting_type?.filter((item: TaskSettingType) => [1, 2].includes(item.id)) || []

  return {
    taskSettingType,
    taskSetting,
    groupByTaskType,
    groupByTaskTypeRoot,
  }
}

/**
 * 尝试解析 JSON 字符串
 * @param jsonString - 要解析的 JSON 字符串
 * @returns 解析后的对象，如果解析失败则返回 null
 */
function tryParseJSON(jsonString: string | null | undefined): any {
  if (!jsonString) return null
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('JSON 解析错误:', e)
    return null
  }
}
