import { getToken } from '@/utils/storage'
import { Navigate, useLocation } from 'react-router-dom'

/**
 * 认证路由组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {React.ReactNode} 渲染的组件
 */
export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getToken()
  const location = useLocation()

  // 如果已认证
  if (token) {
    // 如果路径不是以 /admin 开头
    if (!location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin" state={{ from: location }} replace />
    }
  }

  if (!token) {
    // 如果未认证，重定向到登录页面
    if (location.pathname !== '/login') {
      return <Navigate to="/login" state={{ from: location }} replace />
    }
  }

  // 如果已认证且角色匹配，渲染子组件
  return children
}
