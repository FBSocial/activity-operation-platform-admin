import { addActivityWhiteList } from '@/api/admin'
import SafeModalForm from '@/components/SafeModalForm'
import { useMessage } from '@/hooks/useMessage'
import { Button, Popover } from 'antd'
import WhiteList from './WhiteList'
import schema from './schema'

interface WhiteListModalProps {
  buttonName?: string
  title?: string
  value?: Record<string, any>
  readOnly?: boolean
  disabled?: boolean
  showTooltip?: boolean
  onChange?: (values: Record<string, any>) => void
  activityId: number
}

/**
 * 白名单模态框组件
 *
 * 该组件用于显示和编辑活动的白名单。
 *
 * @param {Object} props - 组件属性
 * @param {string} [props.buttonName='白名单'] - 按钮名称
 * @param {string} [props.title] - 模态框标题
 * @param {Record<string, any>} [props.value] - 表单初始值
 * @param {boolean} [props.readOnly=false] - 是否只读
 * @param {boolean} [props.disabled=false] - 是否禁用
 * @param {boolean} [props.showTooltip=false] - 是否显示工具提示
 * @param {(values: Record<string, any>) => void} [props.onChange] - 表单值变化时的回调函数
 * @param {number} props.activityId - 活动 ID
 * @returns {JSX.Element} 返回包含白名单模态框的 JSX 元素
 */
export const WhiteListModal = (props: WhiteListModalProps) => {
  const { buttonName = '白名单', title, readOnly, disabled, activityId } = props
  const messageApi = useMessage()

  /**
   * 处理表单提交
   *
   * @param {any} values - 表单值
   */
  const handleFormFinish = async (values: any) => {
    console.log('Form values:', values)
    const params = {
      members:
        typeof values.members === 'string' ?
          values.members
            ?.split(',')
            .map((item: string) => (/\d/g.test(item) ? Number(item.trim()) : item))
            .filter(Boolean)
        : [values.members],
      activity_id: activityId,
    }

    try {
      const res = await addActivityWhiteList({
        activity_id: activityId,
        params: params,
      })

      if (res.activity_id) {
        messageApi.success(`活动 ID: ${res?.activity_id} 添加白名单执行成功`)
      } else {
        messageApi.error('添加白名单失败')
      }
    } catch (error) {
      console.error('添加白名单失败', error)
      messageApi.error('添加白名单失败')
    }
  }

  return (
    <SafeModalForm
      title={title ?? ''}
      record={undefined}
      schema={schema}
      onFinish={handleFormFinish}
      trigger={
        <Popover content={<WhiteList activityId={activityId} />} title="白名单列表" placement="left" destroyTooltipOnHide>
          <Button type="link" disabled={disabled || readOnly}>
            {buttonName}
          </Button>
        </Popover>
      }
    ></SafeModalForm>
  )
}
