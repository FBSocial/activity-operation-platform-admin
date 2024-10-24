import { CopyOutlined } from '@ant-design/icons'
import { Alert, Button, Drawer, Tooltip } from 'antd'
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'

/**
 * 响应式 iframe 查看器上下文接口
 */
interface ResponsiveIframeViewerContextType {
  openDrawer: (url: string, title: string, options?: { width?: number; onCopy?: (url: string) => void }) => void
  closeDrawer: () => void
}

/**
 * 响应式 iframe 查看器上下文
 */
export const ResponsiveIframeViewerContext = createContext<ResponsiveIframeViewerContextType | undefined>(undefined)

/**
 * 使用响应式 iframe 查看器的 hook
 * @returns {Object} 包含 openDrawer 和 closeDrawer 方法的对象
 */
export const useResponsiveIframeViewer = () => {
  const context = useContext(ResponsiveIframeViewerContext)
  if (!context) {
    throw new Error('useResponsiveIframeViewer must be used within a ResponsiveIframeViewerProvider')
  }
  return context
}

/**
 * 响应式 iframe 查看器提供者属性接口
 */
interface ResponsiveIframeViewerProviderProps {
  children: React.ReactNode // 子节点
}

/**
 * 响应式 iframe 查看器提供者
 *
 * 该组件用于管理响应式 iframe 查看器的全局状态，并提供打开和关闭抽屉的方法。
 *
 * @param {ResponsiveIframeViewerProviderProps} props - 提供者属性
 * @returns {JSX.Element} 返回包含上下文提供者和模态框的 JSX 元素
 */
export const ResponsiveIframeViewerProvider: React.FC<ResponsiveIframeViewerProviderProps> = ({ children }) => {
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    url: '',
    title: '',
    width: 650,
    onCopy: undefined,
  })

  /**
   * 打开抽屉
   * @param {string} url - iframe 的 URL
   * @param {string} title - 抽屉的标题
   * @param {OpenDrawerOptions} [options] - 打开抽屉的选项
   */
  const openDrawer = useCallback((url: string, title: string, options?: { width?: number; onCopy?: (url: string) => void }) => {
    setDrawerState({
      isOpen: true,
      url,
      title,
      width: options?.width || 600,
      onCopy: options?.onCopy,
    })
  }, [])

  /**
   * 关闭抽屉
   */
  const closeDrawer = useCallback(() => {
    setDrawerState(prev => ({ ...prev, isOpen: false }))
  }, [])

  const contextValue = useMemo(
    () => ({
      openDrawer,
      closeDrawer,
    }),
    [openDrawer, closeDrawer]
  )

  return (
    <ResponsiveIframeViewerContext.Provider value={contextValue}>
      {children}
      <DrawerComponent {...drawerState} onClose={closeDrawer} />
    </ResponsiveIframeViewerContext.Provider>
  )
}

/**
 * Drawer 组件
 */
interface DrawerState {
  isOpen: boolean
  url: string
  title: string
  width: number
  onCopy?: (url: string) => void
}

const DrawerComponent: React.FC<DrawerState & { onClose: () => void }> = ({ isOpen, url, title, width, onCopy, onClose }) => {
  return ReactDOM.createPortal(
    <Drawer
      title={title}
      placement="right"
      closable={true}
      onClose={onClose}
      open={isOpen}
      width={width}
      extra={
        onCopy && (
          <Tooltip title="复制活动的 URL">
            <Button type="primary" onClick={() => onCopy(url)} icon={<CopyOutlined />}>
              复制活动链接
            </Button>
          </Tooltip>
        )
      }
    >
      <div className="flex h-full flex-col bg-gray-100 p-4">
        <Alert banner message="这是模拟的设备预览分辨率，实际效果请在设备上查看" className="my-2"></Alert>
        {/* 设备信息栏 */}
        <div className="mb-4 flex items-center justify-between rounded-lg bg-white p-2 shadow">
          <span>设备: iPhone 14 Pro Max</span>
          <span>430 x 932</span>
          <span>100%</span>
        </div>

        {/* 设备预览区域 */}
        <div className="flex flex-grow items-center justify-center overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="relative h-[960px] w-[458px] rounded-[2.5rem] border-[14px] border-gray-800 bg-gray-800 dark:border-gray-800">
            {/* 侧边按钮装饰 */}
            <div className="absolute -start-[17px] top-[72px] h-[32px] w-[3px] rounded-s-lg bg-gray-800 dark:bg-gray-800"></div>
            <div className="absolute -start-[17px] top-[124px] h-[46px] w-[3px] rounded-s-lg bg-gray-800 dark:bg-gray-800"></div>
            <div className="absolute -start-[17px] top-[178px] h-[46px] w-[3px] rounded-s-lg bg-gray-800 dark:bg-gray-800"></div>
            <div className="absolute -end-[17px] top-[142px] h-[64px] w-[3px] rounded-e-lg bg-gray-800 dark:bg-gray-800"></div>
            {/* 内容区域 */}
            <div className="h-[932px] w-[430px] overflow-hidden rounded-[2rem] bg-white dark:bg-gray-800">
              <iframe
                src={url}
                className="h-full w-full border-none"
                style={{
                  width: '430px',
                  height: '932px',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>,
    document.body
  )
}
