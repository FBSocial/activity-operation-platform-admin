import { lockActivity, type ActivityListItemData } from '@/api/admin'
import { useMessage } from '@/hooks/useMessage'
import { Button, Popconfirm, Tooltip } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CopyAction({ record }: { record: ActivityListItemData }): JSX.Element {
  const messageApi = useMessage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  /**
   * 编辑活动
   */
  const handleCopy = async () => {
    try {
      setLoading(true)
      // 编辑前先加锁,成功再进入编辑页面
      await lockActivity({ activity_id: record.activity_id })

      navigate(`/admin/lottery-activity/copy`, {
        state: {
          copyActivityId: record.activity_id,
        },
      })
    } catch (error) {
      messageApi.success(`复制失败,请重试,活动 ID: ${record.activity_id}`)
      console.log('%c Line:147 🍣 error', 'color:#ea7e5c', error)
    }
    setLoading(false)
  }

  return (
    <Popconfirm
      title={
        <div>
          确定要复制该活动【ID:{record.activity_id}】吗？
          <br />
          会复制该模板的数据进入编辑态，需要手动保存模板才生效!
        </div>
      }
      onConfirm={handleCopy}
      okText="确定"
      cancelText="取消"
      placement="left"
      autoAdjustOverflow
    >
      <Tooltip title="复制该活动的配置" placement="left">
        <Button type="link" loading={loading}>
          复制
        </Button>
      </Tooltip>
    </Popconfirm>
  )
}
