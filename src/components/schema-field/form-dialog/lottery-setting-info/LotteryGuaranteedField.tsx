import { createGift, getConfGiftDetail, getConfGiftList, GiftType, saveGift, type ConfGiftData } from '@/api/admin'
import SafeModalForm from '@/components/SafeModalForm'
import { useLotteryActivityId } from '@/contexts/LotteryActivityIdContext'
import { useLotteryActivityData } from '@/contexts/LotteryActivityIdDataContext'
import { useMessage } from '@/hooks/useMessage'
import { PlusOutlined } from '@ant-design/icons'
import { observer, useField, useForm } from '@formily/react'
import { toJS } from '@formily/reactive'
import { isEmpty } from '@formily/shared'
import { Button, Card, Space, Tooltip } from 'antd'
import { pick } from 'es-toolkit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { lotteryGuaranteedSchema } from './schema'

interface LotteryGuaranteedFieldProps {
  buttonName?: string
  value?: Record<string, any>
  readOnly?: boolean
  disabled?: boolean
  showTooltip?: boolean
  onChange?: (values: Record<string, any>) => void
}

export const LotteryGuaranteedField = observer((props: LotteryGuaranteedFieldProps) => {
  const { buttonName, value, readOnly, disabled, showTooltip, onChange } = props
  const messageApi = useMessage()
  const field = useField()
  const form = useForm()
  const { activityId } = useLotteryActivityId()
  const [listThanksData, setListThanksData] = useState<ConfGiftData | undefined>(undefined)
  const { activityData } = useLotteryActivityData()
  /**
   * 获取奖品配置列表
   */
  const fetchData = useCallback(async () => {
    if (!activityId) return
    try {
      const result = await getConfGiftList({ activity_id: activityId })
      // 先找到保底奖品的列表项
      const thanksGift = result.find(item => item.type === GiftType.THANKS)

      if (thanksGift && thanksGift?.draw_gift_id) {
        const res = await getConfGiftDetail(thanksGift?.activity_id, thanksGift?.draw_gift_id)
        const gift = res?.gift ?? {}
        const params = pick(res, ['position', 'probability'])
        const formilyFieldValue = {
          ...params,
          ...gift,
        }
        setListThanksData(thanksGift)
        onChange?.(formilyFieldValue)
      }
    } catch (error) {
      messageApi.error('获取保底奖品配置失败')
    }
  }, [activityId, messageApi, onChange])

  const formData = useMemo(() => {
    return toJS(value)
  }, [value])

  const disabledSetting = useMemo(() => {
    if (activityData?.online_at) return true
    return !activityId || readOnly || disabled
  }, [activityData?.online_at, activityId, readOnly, disabled])

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (val: any) => {
    try {
      // 如何没有礼物 id 就是创建，否则就是更新
      if (listThanksData && listThanksData?.draw_gift_id) {
        const gift = {
          ...listThanksData.gift,
          ...val,
        }
        const params = {
          activity_id: listThanksData?.activity_id,
          position: val.position,
          type: val.type,
          probability: val.probability,
          draw_gift_id: listThanksData?.draw_gift_id,
          gift,
        }
        await saveGift(listThanksData?.activity_id, listThanksData?.draw_gift_id, params)
        form.notify('customRefreshEvent', { lotteryGuaranteed: 'update' })
        fetchData()
      } else {
        await createGift({ activity_id: activityId, ...val })
        form.notify('customRefreshEvent', { lotteryGuaranteed: 'create' })
        fetchData()
      }
    } catch (error) {
      console.log('%c Line:38 🍓 error', 'color:#42b983', error)
      messageApi.error('操作失败')
    }
  }

  const renderCard = useMemo(() => {
    if (isEmpty(formData)) return null

    return (
      <div className="my-2">
        <Card style={{ width: '180px' }} cover={<img alt={formData!.name} src={formData!.img} />} hoverable>
          <Card.Meta description={<div>奖品名: {formData!.name}</div>} />
        </Card>
      </div>
    )
  }, [formData])

  return (
    <div>
      <Space>
        <SafeModalForm
          title={field.title}
          record={formData}
          schema={lotteryGuaranteedSchema}
          onFinish={val => {
            handleSubmit(val)
          }}
          trigger={
            <Tooltip title={showTooltip ? (field.description ?? '') : ''} placement="bottom">
              <Button type="default" icon={<PlusOutlined />} disabled={disabledSetting}>
                {buttonName || '配置'}
              </Button>
            </Tooltip>
          }
        ></SafeModalForm>
        <span className={isEmpty(formData) ? 'text-red-500' : 'text-green-500'}>{isEmpty(formData) ? '未配置' : '已配置'}</span>
      </Space>
      {renderCard}
    </div>
  )
})
