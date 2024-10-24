import NoAuthAccessPage from '@/pages/403'
import { AuthRoute } from '@/pages/components/AuthRoute'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { adminRoutes } from './admin-routes'

// 使用 React.lazy 加载组件
const Login = lazy(() => import('@/pages/login'))
const PageLayout = lazy(() => import('@/layout/PageLayout'))
const EmptyLayout = lazy(() => import('@/layout/EmptyLayout'))
const NotFound = lazy(() => import('@/pages/404'))
const SelectChannel = lazy(() => import('@/pages/select-guild'))

// 定义加载指示器
const LoadingIndicator = () => <></>

// 定义路由配置
export const routes = [
  {
    path: '',
    index: true,
    element: <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: (
      <AuthRoute>
        <Suspense fallback={<LoadingIndicator />}>
          <Login />
        </Suspense>
      </AuthRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: <NoAuthAccessPage />,
  },
  {
    path: '/admin',
    element: (
      <AuthRoute>
        <Suspense fallback={<LoadingIndicator />}>
          <EmptyLayout />
        </Suspense>
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <SelectChannel />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PageLayout />
          </Suspense>
        ),
        children: adminRoutes,
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingIndicator />}>
        <NotFound />
      </Suspense>
    ),
  },
]

// 创建路由器
const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL })

// 导出 RouterProvider 组件
export const AppRouter = () => <RouterProvider router={router} />
