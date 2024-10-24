import { createContext, ReactNode, useContext, useState } from 'react'

interface LotteryActivityIdContext {
  activityId: string | number | undefined
  setActivityId: (id: string | number | undefined) => void
}

const LotteryActivityIdContext = createContext<LotteryActivityIdContext | undefined>(undefined)

/**
 * 活动上下文提供者组件
 */
export function LotteryActivityIdProvider({ children }: { children: ReactNode }) {
  const [activityId, setActivityId] = useState<string | number | undefined>(undefined)

  return <LotteryActivityIdContext.Provider value={{ activityId, setActivityId }}>{children}</LotteryActivityIdContext.Provider>
}

/**
 * 自定义 Hook，用于在组件中获取和设置活动 ID
 */
export function useLotteryActivityId() {
  const context = useContext(LotteryActivityIdContext)
  if (context === undefined) {
    throw new Error('useLotteryActivityId must be used within an LotteryActivityIdProvider')
  }
  return context
}
