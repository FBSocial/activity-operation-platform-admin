import NoAuthAccessPage from '@/pages/403'
import { AuthRoute } from '@/pages/components/AuthRoute'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { adminRoutes } from './admin-routes'

// 使用 React.lazy 加载组件
const Login = lazy(() => import('@/pages/login'))
const PageLayout = lazy(() => import('@/layout/PageLayout'))
const NotFound = lazy(() => import('@/pages/404'))

// 定义加载指示器
const LoadingIndicator = () => <></>

// 定义路由配置
export const routes = [
  {
    path: '/',
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
          <PageLayout />
        </Suspense>
      </AuthRoute>
    ),
    children: adminRoutes,
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
const AppRouter = () => <RouterProvider router={router} />

export default AppRouter
