import { RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import clsx from 'clsx'

type CollapsedButtonProps = {
  collapsed: boolean
  setCollapsed?: (collapsed: boolean) => void
  className?: string
}
const CollapsedButton = ({ collapsed, setCollapsed, className }: CollapsedButtonProps) => {
  const toggleCollapsed = () => {
    setCollapsed?.(!collapsed)
  }

  return (
    <Button type="default" shape="circle" onClick={toggleCollapsed} className={className ?? ''} size="small">
      <RightOutlined className={clsx([collapsed ? 'rotate-180' : '', 'transition-all'])} />
    </Button>
  )
}

export default CollapsedButton
