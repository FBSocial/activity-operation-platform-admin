import type { GetActivityDetail } from '@/api/admin'
import { createContext, ReactNode, useContext, useState } from 'react'

interface LotteryActivityIdDataContext {
  activityData: GetActivityDetail | undefined
  setActivityData: (data: GetActivityDetail | undefined) => void
}

const LotteryActivityIdDataContext = createContext<LotteryActivityIdDataContext | undefined>(undefined)

/**
 * 活动上下文提供者组件
 */
export function LotteryActivityDataProvider({ children }: { children: ReactNode }) {
  const [activityData, setActivityData] = useState<GetActivityDetail | undefined>(undefined)

  return <LotteryActivityIdDataContext.Provider value={{ activityData, setActivityData }}>{children}</LotteryActivityIdDataContext.Provider>
}

/**
 * 自定义 Hook，用于在组件中获取和设置活动数据
 */
export function useLotteryActivityData() {
  const context = useContext(LotteryActivityIdDataContext)
  if (context === undefined) {
    throw new Error('useLotteryActivityId must be used within an LotteryActivityIdProvider')
  }
  return context
}
