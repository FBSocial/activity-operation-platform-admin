import {
  getAllTaskSettings,
  getGuildChannels,
  getGuildTags,
  type ChannelInfo,
  type TagInfo,
  type TaskSettingData,
  type TaskSettingType,
} from '@/api/admin/activity/task'
import { groupBy } from 'es-toolkit' // 假设使用 lodash 的 groupBy 函数
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

interface LotteryActivityTaskTypeList {
  taskSetting: TaskSettingData[]
  taskSettingType: TaskSettingType[]
  groupByTaskType: Record<number, TaskSettingData[]>
  groupByTaskTypeRoot: TaskSettingData[]
}

interface GuildDataContextType {
  channels: ChannelInfo[]
  tags: TagInfo[]
  lotteryActivityTaskTypeList: LotteryActivityTaskTypeList | null
  loading: boolean
  error: string | null
  fetchGuildData: (guildId: string) => Promise<void>
}

const GuildDataContext = createContext<GuildDataContextType | undefined>(undefined)

export function GuildDataProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<ChannelInfo[]>([])
  const [tags, setTags] = useState<TagInfo[]>([])
  const [lotteryActivityTaskTypeList, setLotteryActivityTaskTypeList] = useState<LotteryActivityTaskTypeList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGuildData = useCallback(async (guildId: string) => {
    setLoading(true)
    setError(null)
    try {
      const [channelsData, tagsData, taskData] = await Promise.all([getGuildChannels(guildId), getGuildTags(guildId), getAllTaskSettings({})])

      setChannels(channelsData)
      setTags(tagsData)

      const taskSetting = taskData.task_setting.map(item => ({
        ...item,
        fb_jump: tryParseJSON(item.fb_jump),
      }))

      const filterTaskEvent = [
        'task_game_login_fblogin',
        'task_game_play_passing',
        'task_mall_order_product',
        'task_mall_order_amount',
        'task_mall_order_number',
      ]
      const filterTaskSetting = taskSetting.filter(item => !filterTaskEvent.includes(item.task_event))
      const groupByTaskType = groupBy(filterTaskSetting, item => item.type)
      const groupByTaskTypeRoot = groupByTaskType[1] || []

      const taskSettingType = taskData.task_setting_type?.filter(item => item.id !== 4)
      setLotteryActivityTaskTypeList({
        taskSettingType: taskSettingType,
        taskSetting,
        groupByTaskType,
        groupByTaskTypeRoot,
      })
    } catch (err) {
      setError('获取公会数据失败')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <GuildDataContext.Provider value={{ channels, tags, lotteryActivityTaskTypeList, loading, error, fetchGuildData }}>
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

// 辅助函数：尝试解析 JSON
function tryParseJSON(jsonString: string | null | undefined): any {
  if (!jsonString) return null
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.error('JSON parse error:', e)
    return null
  }
}
