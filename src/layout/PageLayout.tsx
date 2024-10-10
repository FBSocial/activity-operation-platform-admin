import { Layout } from 'antd'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import LeftSider from './LeftSider'
import TopHeader from './TopHeader'

function PageLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider width={185} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)} theme="dark">
        <LeftSider collapsed={collapsed} />
      </Layout.Sider>
      <Layout>
        <Layout.Header className="h-12 border-b border-gray-200 bg-white px-4">
          <TopHeader />
        </Layout.Header>
        <Layout.Content className="h-[calc(100vh-133px)] bg-[#f5f6fa] px-5 py-2">
          <div className="h-full overflow-y-auto">
            <Outlet />
          </div>
        </Layout.Content>
        <Layout.Footer style={{ textAlign: 'center' }} className="h-8 py-1">
          ©{new Date().getFullYear()} Created by IDreamSky
        </Layout.Footer>
      </Layout>
    </Layout>
  )
}

export default PageLayout
