import { copy } from '@/utils/common-func'
import { Button, Drawer, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { ResponsiveIframeViewer, ViewportSize } from 'react-responsive-iframe-viewer'

/**
 * 响应式 iframe 查看器抽屉组件的属性接口
 */
interface ResponsiveIframeViewerDrawerProps {
  visible?: boolean // 控制抽屉的可见性
  onCancel?: () => void // 关闭抽屉时的回调函数
  src: string // iframe 的 URL
  title: string // 抽屉的标题
  width?: number | string // 抽屉的宽度
  height?: number | string // 抽屉的高度
  trigger?: React.ReactNode // 触发器组件
}

/**
 * 响应式 iframe 查看器抽屉组件
 *
 * 该组件用于显示一个包含响应式 iframe 的抽屉，并提供复制 iframe URL 的功能。
 *
 * @param {ResponsiveIframeViewerDrawerProps} props - 组件的属性
 * @returns {JSX.Element} 返回包含抽屉的 JSX 元素
 */
const ResponsiveIframeViewerDrawer: React.FC<ResponsiveIframeViewerDrawerProps> = ({
  visible: externalVisible,
  onCancel,
  src,
  title,
  width = 660,
  height,
  trigger,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(externalVisible || false)

  useEffect(() => {
    setDrawerVisible(externalVisible || false)
  }, [externalVisible])

  const handleClose = () => {
    setDrawerVisible(false)
    onCancel?.()
  }

  const handleTriggerClick = () => {
    setDrawerVisible(true)
  }

  const handleCopy = () => {
    copy(src)
  }

  return (
    <>
      {trigger && React.cloneElement(trigger as React.ReactElement, { onClick: handleTriggerClick })}
      <Drawer
        title={title}
        open={drawerVisible}
        onClose={handleClose}
        height={height}
        width={width}
        maskClosable={false}
        footer={
          <div className="flex items-center justify-center">
            <Tooltip title="复制活动的 URL">
              <Button type="primary" onClick={handleCopy}>
                复制 URL
              </Button>
            </Tooltip>
          </div>
        }
        destroyOnClose
      >
        <ResponsiveIframeViewer src={src} title={title} showControls={false} size={ViewportSize.mobile} />
      </Drawer>
    </>
  )
}

export default ResponsiveIframeViewerDrawer
