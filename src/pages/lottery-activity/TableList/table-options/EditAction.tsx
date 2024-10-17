import { lockActivity, type ActivityListItemData } from '@/api/admin'
import { ActivityStatus } from '@/enum/lottery-activity'
import { useMessage } from '@/hooks/useMessage'
import { useDebounceFn } from 'ahooks'
import { Button, Space, Tooltip } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EditAction({ record }: { record: ActivityListItemData }): JSX.Element {
  const messageApi = useMessage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  /**
   * 编辑活动
   */
  const handleEdit = async () => {
    try {
      setLoading(true)
      // 编辑前先加锁,成功再进入编辑页面
      await lockActivity({ activity_id: record.activity_id })

      navigate(`/admin/lottery-activity/edit/${record.activity_id}`)
    } catch (error) {
      messageApi.success(`进入编辑失败,请重试,活动 ID: ${record.activity_id}`)
      console.log('%c Line:147 🍣 error', 'color:#ea7e5c', error)
    }
    setLoading(false)
  }

  const { run: debounceHandleEdit } = useDebounceFn(handleEdit, { wait: 500 })
  return (
    <Tooltip
      title={
        <Space direction="vertical">
          {record.lock ?
            `用户"${record.nickname}"在编辑中`
          : <>
              <div>活动上线前支持编辑，但更改抽奖样式需提示奖品信息会清零</div>
              <div>活动开始后，需要先将活动下线，才支持编辑，重新上线后才生效</div>
            </>
          }
        </Space>
      }
    >
      <Button type="link" loading={loading} disabled={record.status === ActivityStatus.Started || record.lock} onClick={debounceHandleEdit}>
        编辑
      </Button>
    </Tooltip>
  )
}
