import { useMessage } from '@/hooks/useMessage'
import GuildSelect from '@/pages/components/GuildSelect'
import { getGuildId, getUserInfo, removeUserInfo, setGuildInfo } from '@/utils/storage'
import { ExclamationCircleOutlined, LoginOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Space, Tooltip, type MenuProps } from 'antd'
import modal from 'antd/es/modal'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * 顶部导航栏组件
 * @returns {JSX.Element} 返回顶部导航栏组件
 */
function TopHeader() {
  const navigate = useNavigate()
  const location = useLocation()

  const messageApi = useMessage()
  const userInfo = getUserInfo()
  const [guildId, setGuildId] = useState('')

  /**
   * 下拉菜单项
   */
  const items: MenuProps['items'] = [
    {
      label: '退出登录',
      key: 'logout',
      icon: <LoginOutlined />,
    },
  ]

  /**
   * 处理下拉菜单点击事件
   * @param {Object} event - 点击事件对象
   * @param {string} event.key - 点击的菜单项 key
   */
  const handleClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      modal.confirm({
        title: '是否要退出当前账号？',
        icon: <ExclamationCircleOutlined color="#198CFE" />,
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onOk: () => {
          removeUserInfo()
          navigate('/login')
          messageApi.success({
            content: '退出成功',
            duration: 1,
          })
        },
      })
    }
  }

  /**
   * 处理社区选择变化事件
   * @param {string} value - 选中的社区 ID
   * @param {any} option - 选中的社区选项
   * @param {any} item - 选中的社区对象
   */
  const handleGuildSelectChange = (value: string, option: any, item: any) => {
    console.log('%c Line:65 🌶 item', 'color:#42b983', item)
    setGuildInfo(item)
    navigate(`/admin/lottery-activity/list`, { replace: true, state: { key: new Date().getTime(), guild_id: getGuildId() } })
  }

  /**
   * 初始化时获取当前社区 ID
   */
  useEffect(() => {
    const guild_id = getGuildId()
    if (guild_id) {
      setGuildId(guild_id)
    }
  }, [])

  /**
   * 监听路由状态变化，更新社区 ID
   */
  useEffect(() => {
    if (location.state?.key) {
      const guild_id = getGuildId()
      if (guild_id) {
        setGuildId(guild_id)
      }
    }
  }, [location.state])

  return (
    <div className="flex h-full w-full items-center justify-end">
      <Space>
        <GuildSelect
          style={{ width: 280 }}
          value={guildId}
          onChange={handleGuildSelectChange}
          suffixIcon={
            <Tooltip title="下拉框可以快速切换社区，不会保留当前表单正在配置的数据，慎重操作">
              <QuestionCircleOutlined />
            </Tooltip>
          }
        />
      </Space>
      <div className="mx-2">
        <Dropdown placement="bottomRight" menu={{ items, onClick: handleClick }} trigger={['click']}>
          <div className="flex h-full cursor-pointer select-none items-center gap-2 rounded px-4 py-1 hover:bg-gray-100">
            <Avatar size={32} src={userInfo?.avatar}>
              USER
            </Avatar>
            <div className="max-w-[125px] truncate text-sm">{userInfo?.nickname}</div>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default TopHeader
