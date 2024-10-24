import { addCdKey, getConfGiftList, type ActivityListItemData, type ConfGiftData } from '@/api/admin'
import { FlexProTable } from '@/components/FlexProTable'
import ImagePreview from '@/components/ImagePreview'
import SafeModalForm from '@/components/SafeModalForm'
import { useMessage } from '@/hooks/useMessage'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { Button, Drawer, Space, Tooltip } from 'antd'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import complementActionSchema from './schema'

/**
 * ComplementDrawerForm 组件
 * 用于显示补码操作的主抽屉组件
 * @param {Object} props - 组件属性
 * @param {ActivityListItemData} props.record - 活动列表项数据
 * @param {React.ReactElement} props.trigger - 触发抽屉显示的按钮组件
 * @returns {JSX.Element} 返回一个包含补码操作抽屉的组件
 */
const ComplementDrawerForm = ({ record, trigger }: { record: ActivityListItemData; trigger: React.ReactElement }): JSX.Element => {
  const [open, setOpen] = useState(false)
  const messageApi = useMessage()
  const actionRef = useRef<ActionType>()

  const showDrawer = useCallback(() => {
    setOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleTableRequest = async () => {
    try {
      const data = await getConfGiftList({ activity_id: record.activity_id })
      return {
        success: true,
        data: data as any,
      }
    } catch (error) {
      messageApi.error('获取活动列表失败')
      return {
        success: false,
        data: [],
        total: 0,
      }
    }
  }

  const columns: ProColumns<ConfGiftData>[] = useMemo(
    () => [
      {
        title: '奖品ID',
        dataIndex: 'gift',
        key: 'draw_gift_id',
        render: (_, record) => <span>{record.gift.gift_id}</span>,
      },
      {
        title: '奖品图',
        dataIndex: 'gift',
        key: 'gift_icon',
        render: (_, record) => <ImagePreview src={record?.gift.img} style={{ width: 70, height: 70, background: '#888' }} />,
      },
      {
        title: '奖品名称',
        dataIndex: 'gift',
        key: 'gift_name',
        render: (_, record) => <span>{record?.gift.name}</span>,
      },
      {
        title: '奖品概率',
        dataIndex: 'probability',
        key: 'probability',
      },
      {
        title: 'Android奖品数量',
        key: 'remain_total_android',
        width: 220,
        align: 'center',
        render: (_, record) => {
          const giftPrize = record?.gift.gift_prize?.find?.(item => item.platform === 2)
          return (
            <Space>
              <span>{record.remain_total_android}</span>
              <SafeModalForm
                title={`礼物 ID:${giftPrize?.gift_id}补码`}
                record={{}}
                schema={complementActionSchema}
                onFinish={(formValue: any) => {
                  if (formValue?.file_url && giftPrize) {
                    addCdKey({
                      activity_id: record.activity_id,
                      params: {
                        file_url: formValue?.file_url,
                        draw_gift_id: giftPrize.gift_id,
                        prize_id: giftPrize.prize_id,
                        activity_id: record.activity_id,
                      },
                    }).then(res => {
                      messageApi.success(`礼物 ID:${giftPrize?.gift_id}补码成功`)
                      actionRef?.current?.reload?.()
                    })
                  }
                }}
                trigger={
                  <Space direction="vertical">
                    <div>
                      <Space>
                        <Tooltip title={'给活动补码'} placement="bottom">
                          <Button type="link">补码</Button>
                        </Tooltip>
                      </Space>
                    </div>
                  </Space>
                }
              ></SafeModalForm>
            </Space>
          )
        },
      },
      {
        title: 'IOS奖品数量',
        key: 'remain_total',
        width: 220,
        align: 'center',
        render: (_, record) => {
          const giftPrize = record?.gift.gift_prize?.find?.(item => item.platform === 1)

          return (
            <Space>
              <span>{record.remain_total}</span>
              <SafeModalForm
                title={'补码'}
                record={{}}
                schema={complementActionSchema}
                onFinish={(formValue: any) => {
                  if (formValue?.file_url && giftPrize) {
                    addCdKey({
                      activity_id: record.activity_id,
                      params: {
                        file_url: formValue?.file_url,
                        draw_gift_id: giftPrize.gift_id,
                        prize_id: giftPrize.prize_id,
                        activity_id: record.activity_id,
                      },
                    }).then(res => {
                      messageApi.success(`礼物 ID:${giftPrize?.gift_id}补码成功`)
                      actionRef?.current?.reload?.()
                    })
                  }
                }}
                trigger={
                  <Space direction="vertical">
                    <div>
                      <Space>
                        <Tooltip title={'给活动补码'} placement="bottom">
                          <Button type="link">补码</Button>
                        </Tooltip>
                      </Space>
                    </div>
                  </Space>
                }
              ></SafeModalForm>
            </Space>
          )
        },
      },
    ],
    [messageApi]
  )

  return (
    <>
      {trigger && React.cloneElement(trigger, { onClick: showDrawer })}
      <Drawer title={`活动 ID:${record?.activity_id} 补码`} width={1200} onClose={onClose} open={open} maskClosable={false}>
        {/* 在这里添加补码操作的表单内容 */}
        <FlexProTable request={handleTableRequest} toolBarRender={false} columns={columns} pagination={false} search={false} actionRef={actionRef} />
      </Drawer>
    </>
  )
}

export default React.memo(ComplementDrawerForm)
