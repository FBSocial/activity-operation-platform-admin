import type { GuildData } from '@/api/admin'
import { ProCard } from '@ant-design/pro-components'
import { useVirtualList } from 'ahooks'
import { Avatar, Button, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'

type GuildDataProps = {
  listData: GuildData[] | []
  loading?: boolean
  onClick?: (item: GuildData) => void
}
export default function GuildDataCard({ listData, loading, onClick }: GuildDataProps) {
  const containerRef = useRef(null)
  const wrapperRef = useRef(null)
  const [dataList, setDataList] = useState<GuildData[]>([])

  useEffect(() => {
    if (Array.isArray(listData)) {
      setDataList(listData)
    }
  }, [listData])

  const [list] = useVirtualList(dataList, {
    containerTarget: containerRef,
    wrapperTarget: wrapperRef,
    itemHeight: 88,
    overscan: 10,
  })

  return (
    <ProCard title="请选择一个社区" wrap bordered ref={containerRef}>
      <ProCard loading={loading} size="small">
        <div ref={wrapperRef} className="!h-[400px] overflow-auto">
          {list.map(item => {
            return (
              <ProCard bordered key={item.index} className="my-2" size="small">
                <div className="flex items-center justify-between p-2">
                  <Space>
                    <Avatar src={item.data.icon} size={48}></Avatar>
                    <span className="text-base">{item.data.name}</span>
                  </Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      onClick?.(item.data)
                    }}
                  >
                    进入
                  </Button>
                </div>
              </ProCard>
            )
          })}
        </div>
      </ProCard>
    </ProCard>
  )
}
