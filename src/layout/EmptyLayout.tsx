import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * 空白布局组件
 *
 * 这个组件提供了一个最小化的布局，只包含一个 Outlet 用于渲染子路由内容。
 * 适用于需要全屏显示或自定义布局的页面。
 */
const EmptyLayout: React.FC = () => {
  return <Outlet />
}

export default EmptyLayout
