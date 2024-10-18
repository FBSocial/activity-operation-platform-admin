import { GuildDataProvider } from '@/contexts/GuildDataContext'
import { LotteryActivityIdProvider } from '@/contexts/LotteryActivityIdContext'
import { LotteryActivityDataProvider } from '@/contexts/LotteryActivityIdDataContext'
import { ResponsiveIframeViewerProvider } from '@/contexts/ResponsiveIframeViewerContext'
import { Outlet } from 'react-router-dom'

/**
 * 抽奖活动模块的自定义 Outlet 组件
 *
 * 该组件用于在抽奖活动模块中注入 `ResponsiveIframeViewerProvider`，
 * 以便在子路由中使用响应式 iframe 查看器功能。
 *
 * @returns {JSX.Element} 返回包含 `Outlet` 组件的 JSX 元素
 */
export default function LotteryActivityOutlet() {
  return (
    <ResponsiveIframeViewerProvider>
      <GuildDataProvider>
        <LotteryActivityDataProvider>
          <LotteryActivityIdProvider>
            <Outlet />
          </LotteryActivityIdProvider>
        </LotteryActivityDataProvider>
      </GuildDataProvider>
    </ResponsiveIframeViewerProvider>
  )
}
