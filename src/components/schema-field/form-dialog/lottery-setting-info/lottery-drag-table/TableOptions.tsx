import { getConfGiftDetail, GiftPrizePlatform, type ConfGiftData } from '@/api/admin'
import SafeModalForm from '@/components/SafeModalForm'
import { ISchema } from '@formily/react'
import { Button, Popconfirm } from 'antd'
import { omit } from 'es-toolkit'
import { useRef, useState } from 'react'

interface TableOptionsProps<T> {
  schema?: ISchema
  title?: string
  record: T extends ConfGiftData ? T : never
  refreshTableList?: () => void
  onEdit?: (val: T) => void
  onDelete?: (val: T) => void
}
const TableOptions = <T extends object>({ schema, record, title = '', onEdit, onDelete }: TableOptionsProps<T>) => {
  const [giftRes, setGiftRes] = useState<ConfGiftData | null>(null)
  const [editRecord, setEditRecord] = useState<any | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleEditFinish = val => {
    if (!giftRes) return
    const { cd_key_url, cd_key_url_android, is_auto_grant, ...gift_prize_config } = val
    const gift_prize = giftRes?.gift?.gift_prize.map(item => ({
      ...item,
      ...(item.platform === GiftPrizePlatform.IOS ? { cd_key_url } : { cd_key_url_android }),
      is_auto_grant,
    }))
    const gift = {
      ...gift_prize_config,
      gift_prize,
    }
    const callbackData = {
      ...omit(giftRes, ['gift']),
      gift,
      probability: val.probability,
    }
    onEdit?.(callbackData as any)

    setGiftRes(null)
    setEditRecord(null)
  }

  return (
    <span>
      <Button
        type="link"
        onClick={async () => {
          if (!record?.activity_id || !record?.draw_gift_id) {
            return
          }
          try {
            const res = await getConfGiftDetail(record?.activity_id, record?.draw_gift_id)
            setGiftRes(res)
            const gift_prize = res?.gift?.gift_prize
            const formData = {
              ...omit(res?.gift, ['gift_prize']),
              is_auto_grant: gift_prize?.[0]?.is_auto_grant,
              cd_key_url_android: gift_prize?.find(item => item.platform === GiftPrizePlatform.ANDROID)?.cd_key_url,
              cd_key_url: gift_prize?.find(item => item.platform === GiftPrizePlatform.IOS)?.cd_key_url,
              probability: res.probability,
            }
            setEditRecord(formData)
            setTimeout(() => {
              triggerRef.current?.click()
            }, 0)
          } catch (error) {
            console.log('%c Line:21 🍩 error', 'color:#7f2b82', error)
          }
        }}
      >
        编辑
      </Button>
      {onEdit && schema && (
        <SafeModalForm
          title={title}
          schema={schema}
          record={editRecord}
          onFinish={handleEditFinish}
          trigger={<span ref={triggerRef} className="pointer-events-none hidden"></span>}
        />
      )}
      {onDelete && (
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => {
            onDelete(record)
          }}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" style={{ color: 'red' }}>
            删除
          </Button>
        </Popconfirm>
      )}
    </span>
  )
}

export default TableOptions
