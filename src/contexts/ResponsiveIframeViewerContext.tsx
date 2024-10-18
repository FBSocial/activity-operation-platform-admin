import ResponsiveIframeViewerModal from '@/components/ResponsiveIframeViewerModal'
import React, { createContext, ReactNode, useCallback, useEffect, useState } from 'react'

/**
 * 响应式 iframe 查看器上下文接口
 */
interface ResponsiveIframeViewerContextProps {
  visible: boolean // 控制抽屉的可见性
  src: string // iframe 的 URL
  title: string // 抽屉的标题
  width: number | string // 抽屉的宽度
  height: number | string // 抽屉的高度
  openDrawer: (src: string, title: string, width?: number | string, height?: number | string) => void // 打开抽屉的方法
  closeDrawer: () => void // 关闭抽屉的方法
}

/**
 * 响应式 iframe 查看器上下文
 */
export const ResponsiveIframeViewerContext = createContext<ResponsiveIframeViewerContextProps | undefined>(undefined)

/**
 * 响应式 iframe 查看器提供者属性接口
 */
interface ResponsiveIframeViewerProviderProps {
  children: ReactNode // 子节点
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
  const [visible, setVisible] = useState(false)
  const [src, setSrc] = useState('')
  const [title, setTitle] = useState('')
  const [width, setWidth] = useState<number | string>(500)
  const [height, setHeight] = useState<number | string>('')

  /**
   * 打开抽屉
   * @param {string} src - iframe 的 URL
   * @param {string} title - 抽屉的标题
   * @param {number | string} [width] - 抽屉的宽度
   * @param {number | string} [height] - 抽屉的高度
   */
  const openDrawer = useCallback((src: string, title: string, width?: number | string, height?: number | string) => {
    setSrc(src)
    setTitle(title)
    if (width !== undefined) setWidth(width)
    if (height !== undefined) setHeight(height)
    setVisible(true)
  }, [])

  /**
   * 关闭抽屉
   */
  const closeDrawer = useCallback(() => {
    setVisible(false)
  }, [])

  useEffect(() => {
    if (!visible) {
      // 重置状态
      setSrc('')
      setTitle('')
      setWidth(600)
      setHeight('')
    }
  }, [visible])

  const contextValue = {
    visible,
    src,
    title,
    width,
    height,
    openDrawer,
    closeDrawer,
  }

  return (
    <ResponsiveIframeViewerContext.Provider value={contextValue}>
      {children}
      <ResponsiveIframeViewerModal title={title} visible={visible} src={src} width={width} height={height} onCancel={closeDrawer} />
    </ResponsiveIframeViewerContext.Provider>
  )
}
