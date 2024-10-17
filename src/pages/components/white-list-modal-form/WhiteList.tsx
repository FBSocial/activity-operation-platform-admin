import { getActivityWhiteList, type ActivityWhiteListItemData } from '@/api/admin'
import { useRequest, useVirtualList } from 'ahooks'
import { Card, Divider, Empty, message } from 'antd'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useRef } from 'react'

interface WhiteListProps {
  activityId: number
}

/**
 * 白名单组件
 *
 * 该组件用于显示活动的白名单列表。
 *
 * @param {Object} props - 组件属性
 * @param {number} props.activityId - 活动 ID
 * @returns {JSX.Element} 返回包含白名单列表的 JSX 元素
 */
const WhiteList: React.FC<WhiteListProps> = ({ activityId }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const {
    data: whiteListRes,
    loading,
    runAsync,
    error,
  } = useRequest(() => getActivityWhiteList({ activity_id: activityId }), {
    manual: true,
    staleTime: 2000,
  })

  const whiteListData = useMemo(() => whiteListRes || [], [whiteListRes])

  const [list] = useVirtualList<ActivityWhiteListItemData>(whiteListData, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 36,
    overscan: 10,
  })

  const isEmpty = useMemo(() => whiteListData.length === 0, [whiteListData])

  useEffect(() => {
    runAsync().catch(err => {
      message.error('获取白名单失败')
      console.error(err)
    })
  }, [activityId, runAsync])

  useEffect(() => {
    if (error) {
      message.error('获取白名单失败')
      console.error(error)
    }
  }, [error])

  return (
    <Card size="small" type="inner" style={{ width: 600 }} loading={loading} title={`活动 ID:${activityId}`}>
      <div className="flex items-center justify-start p-2 text-center">
        <span className="inline-block w-[180px]">用户ID</span>
        <Divider type="vertical" />
        <span className="inline-block w-[130px]">用户名</span>
        <Divider type="vertical" />
        <span className="flex-1">添加时间</span>
      </div>
      <div ref={containerRef} style={{ height: '300px', overflow: 'auto' }}>
        {isEmpty ?
          <div className="flex h-full w-full items-center justify-center">
            <Empty description="暂无白名单" />
          </div>
        : <div ref={wrapperRef}>
            {list.map(item => (
              <div key={item.index} className="flex items-center justify-start border-b p-2 text-center">
                <span className="inline-block w-[180px] overflow-hidden whitespace-normal break-words">{item.data.user_id}</span>
                <Divider type="vertical" />
                <span className="inline-block w-[130px]">{item.data?.nickname}</span>
                <Divider type="vertical" />
                <span className="flex-1">{dayjs.unix(item.data.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
            ))}
          </div>
        }
      </div>
    </Card>
  )
}

export default WhiteList
