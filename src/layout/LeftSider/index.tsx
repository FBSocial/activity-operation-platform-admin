import logo from '@/assets/images/robot-android-droid.svg'
import { antdMenuItems, findActiveKeys, findMenuItemByKey } from '@/routes/utils'
import { Avatar, Menu } from 'antd'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

type MenuProps = {
  collapsed: boolean
}

const LeftSider = ({ collapsed }: MenuProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const items = useMemo(() => antdMenuItems(), [])

  useEffect(() => {
    const { openKeys: newOpenKeys, selectedKeys: newSelectedKeys } = findActiveKeys(items, location.pathname)
    setOpenKeys(newOpenKeys)
    setSelectedKeys(newSelectedKeys)
  }, [location.pathname, items])

  const handleMenuClick = (itemParams: any) => {
    const { key } = itemParams
    const route = findMenuItemByKey(items, key)
    if (route) {
      const path = route['data-meta-fullpath'] as string
      navigate(path)
    }
  }

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  return (
    <div>
      <div
        className={clsx(['relative flex cursor-pointer items-center justify-center py-4 transition-opacity', collapsed && 'gap-4 px-3'])}
        onClick={() => navigate('/admin')}
      >
        <Avatar src={logo} />
        {!collapsed && <span className="inline-block whitespace-nowrap font-bold text-white">{import.meta.env.VITE_APP_TITLE}</span>}
      </div>
      <div className="relative flex-1 px-2">
        <Menu
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={onOpenChange}
          onClick={handleMenuClick}
          style={{ height: '100%', borderRight: 0 }}
          items={items}
        ></Menu>
      </div>
    </div>
  )
}

export default LeftSider
