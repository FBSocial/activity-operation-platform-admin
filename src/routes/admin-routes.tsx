import { lazy, Suspense } from 'react'

// 使用 React.lazy 加载组件
const ActivityTable = lazy(() => import('@/pages/lottery-activity/TableList'))
const ActivityTemplateCreateOrEdit = lazy(() => import('@/pages/lottery-activity/ActivityTemplateCreateOrEdit'))

// 定义加载指示器
const LoadingIndicator = () => <></>

// outlet
import LotteryActivityOutlet from '@/components/outlet/lottery-activity-outlet'
import { NotificationOutlined } from '@ant-design/icons'
export const adminRoutes = [
  {
    path: 'lottery-activity',
    label: '抽奖活动',
    key: 'lottery-activity',
    icon: <NotificationOutlined />,
    element: <LotteryActivityOutlet />,
    children: [
      {
        path: 'list',
        key: 'lottery-activity-list',
        label: '活动列表',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <ActivityTable />
          </Suspense>
        ),
      },
      {
        path: ':action/:activity_id?',
        key: 'lottery-activity-create',
        hideInMenu: true,
        label: '新建活动',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <ActivityTemplateCreateOrEdit />
          </Suspense>
        ),
      },
    ],
  },
  // 其他管理模块可以在这里添加
]
