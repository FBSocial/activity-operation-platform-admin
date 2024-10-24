import { createGift, getConfGiftList, GiftType, saveGift, type ConfGiftData } from '@/api/admin'
import { FlexProTable } from '@/components/FlexProTable'
import ImagePreview from '@/components/ImagePreview'
import SafeModalForm from '@/components/SafeModalForm'
import { useLotteryActivityId } from '@/contexts/LotteryActivityIdContext'
import { useLotteryActivityData } from '@/contexts/LotteryActivityIdDataContext'
import { useMessage } from '@/hooks/useMessage'
import { getMaxPropertyValue, reorderArrayByProperty } from '@/utils/array-utils'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { observer, useField, useForm } from '@formily/react'
import { Button, Space, Tooltip } from 'antd'
import { isEqual } from 'es-toolkit'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { lotteryConfigSchema } from '../schema'
import TableOptions from './TableOptions'

/**
 * LotteryDragTableFormField 组件的属性接口
 */
interface LotteryDragTableFormFieldProps {
  /** 按钮名称 */
  buttonName?: string
  /** 表单值 */
  value?: ConfGiftData[]
  /** 是否只读 */
  readOnly?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否显示提示 */
  showTooltip?: boolean
  /** 值变化时的回调函数 */
  onChange?: (values: { draw_gift_id: number; position: number }[]) => void
}

/**
 * 抽奖奖品配置表格组件
 */
export const LotteryDragTableFormField = observer((props: LotteryDragTableFormFieldProps) => {
  const { buttonName, value = [], readOnly, disabled, showTooltip, onChange } = props
  const field = useField()
  const form = useForm()
  const actionRef = useRef<ActionType>()
  const messageApi = useMessage()
  const { activityId } = useLotteryActivityId()
  const { activityData } = useLotteryActivityData()
  const [data, setData] = useState<ConfGiftData[]>(value)
  const draw_num = field.query('.draw_num').value()
  const [loading, setLoading] = useState(false)

  /**
   * 获取奖品配置列表
   */
  const fetchData = useCallback(async () => {
    if (!activityId) return
    setLoading(true)
    try {
      const result = await getConfGiftList({ activity_id: activityId })
      setData(result)
    } catch (error) {
      messageApi.error('获取奖品配置列表失败')
    } finally {
      setLoading(false)
    }
  }, [activityId, messageApi])

  useEffect(() => {
    fetchData()
  }, [])

  // 过滤出礼物类型的数据
  const tableData = useMemo(() => {
    return data?.filter?.(item => item.type === GiftType.GIFT) || []
  }, [data])

  /**
   * 修改奖品数据
   * @param record 修改的奖品记录
   */
  const modifyData = useCallback(
    async (record: any) => {
      try {
        await saveGift(record.activity_id, record.draw_gift_id, record)
        messageApi.success(`奖品 ID:${record.draw_gift_id}编辑成功`)
        fetchData()
      } catch (error) {
        console.error('修改奖品数据失败:', error)
        messageApi.error(`奖品 ID:${record.draw_gift_id}编辑失败`)
      }
    },
    [fetchData, messageApi]
  )

  /**
   * 删除奖品数据
   * @param record 要删除的奖品记录
   */
  const deleteData = useCallback(
    (record: ConfGiftData) => {
      const newData = data.filter(item => item.draw_gift_id !== record.draw_gift_id)
      setData(newData)
    },
    [data]
  )

  // 表格列配置
  const columns: ProColumns<ConfGiftData>[] = useMemo(
    () => [
      {
        title: '奖品ID',
        dataIndex: 'draw_gift_id',
        key: 'draw_gift_id',
        render: (_, record) => <span>{record?.gift?.gift_id}</span>,
      },
      {
        title: '奖品图',
        dataIndex: 'gift',
        key: 'gift_icon',
        render: (_, record) => <ImagePreview src={record?.gift?.img} style={{ width: 70, height: 70, background: '#888' }} />,
      },
      {
        title: '奖品名称',
        dataIndex: 'gift',
        key: 'gift_name',
        render: (_, record) => <span>{record?.gift?.name}</span>,
      },
      {
        title: '奖品概率',
        dataIndex: 'probability',
        key: 'probability',
      },
      {
        title: 'Android奖品数量',
        key: 'remain_total_android',
        align: 'center',
        render: (_, record) => <span>{record?.remain_total_android}</span>,
      },
      {
        title: 'IOS奖品数量',
        key: 'remain_total',
        align: 'center',
        render: (_, record) => <span>{record?.remain_total}</span>,
      },
      {
        title: '操作',
        search: false,
        key: 'operate',
        width: 140,
        align: 'center' as const,
        render: (_, record) =>
          !activityData?.online_at ?
            <TableOptions schema={lotteryConfigSchema} record={record} onEdit={modifyData} onDelete={deleteData} />
          : <span>不可变更</span>,
      },
    ],
    [activityData?.online_at, deleteData, modifyData]
  )

  // 判断是否禁用添加按钮
  const isDisabled = useMemo(() => {
    return disabled || readOnly || draw_num - 1 === tableData.length
  }, [disabled, readOnly, draw_num, tableData.length])

  /**
   * 处理表单提交
   * @param val 表单值
   */
  const handleFinish = async (val: any) => {
    try {
      let formGiftData: any
      if (typeof val.position === 'number') {
        if (val.position > 255) {
          // 如果 position 大于 255，则对数组进行重排
          const sortedData = reorderArrayByProperty(data, 'position', true)
          formGiftData = sortedData.map((item, index) => ({
            ...item,
            position: data.length - index,
          }))
          formGiftData = formGiftData.map(item => (item.draw_gift_id === val.draw_gift_id ? { ...val, position: data.length } : item))
        } else {
          formGiftData = data.map(item => (item.position === val.position ? val : item))
        }
      } else {
        const maxPosition = getMaxPropertyValue(data, 'position')
        const newPosition = maxPosition < 255 ? maxPosition + 1 : 255
        formGiftData = { ...val, position: newPosition }
      }

      const res = await createGift({ activity_id: activityId, ...formGiftData })

      if (typeof res === 'object' && res.draw_gift_id) {
        // 更新数据
        const newData = Array.isArray(formGiftData) ? formGiftData : [...data, formGiftData]
        setData(newData)
        messageApi.success(`操作礼物成功,ID：${res.draw_gift_id}`)
        fetchData()
      }
    } catch (error) {
      console.error('操作失败:', error)
      messageApi.error('操作失败')
    }
  }

  // 更新父组件的值
  useEffect(() => {
    if (Array.isArray(data)) {
      // 过滤出所有常规礼物并截断到奖品总数-1
      const newNormalGiftData = data
        .filter(item => item.type === GiftType.GIFT)
        .map(item => ({
          draw_gift_id: item.draw_gift_id,
          position: item.position,
        }))
        .slice(0, draw_num - 1)

      // 过滤出所有谢谢参与礼物
      const thanksGift = data
        .filter(item => item.type === GiftType.THANKS)
        .map(item => ({
          draw_gift_id: item.draw_gift_id,
          position: item.position,
        }))

      // 合并常规礼物和谢谢参与礼物
      const newData = [...newNormalGiftData, ...thanksGift].filter(Boolean)

      if (!isEqual(newData, value)) {
        onChange?.(newData)
      }
    } else {
      onChange?.([])
    }
  }, [data, draw_num, onChange, value])

  useEffect(() => {
    form.subscribe(({ type, payload }) => {
      if (type === 'customRefreshEvent' && payload.lotteryGuaranteed) {
        console.log('%c Line:234 🍯 payload.lotteryGuaranteed', 'color:#42b983', payload.lotteryGuaranteed, '保底奖品有操作')
        // 执行刷新逻辑

        fetchData()
      }
    })
  }, [fetchData, form])

  return (
    <div className="flex flex-col">
      <Space>
        <SafeModalForm
          title={field.title}
          record={value}
          schema={lotteryConfigSchema}
          onFinish={handleFinish}
          trigger={
            <Tooltip title={showTooltip ? (field.description ?? '') : ''} placement="bottom">
              <Button type="default" icon={<PlusOutlined />} disabled={isDisabled}>
                {buttonName || '配置'}
              </Button>
            </Tooltip>
          }
        />
        <span>{isDisabled ? '已达到最大配置数量【保底奖品占一个】' : `已添加:${data.length}个[数量计算：常规奖品+保底奖品]`}</span>
      </Space>
      <div className="mt-4 w-full">
        <FlexProTable
          loading={loading}
          dataSource={tableData}
          rowKey="draw_gift_id"
          toolBarRender={false}
          columns={columns}
          pagination={false}
          search={false}
          actionRef={actionRef}
        />
      </div>
    </div>
  )
})
