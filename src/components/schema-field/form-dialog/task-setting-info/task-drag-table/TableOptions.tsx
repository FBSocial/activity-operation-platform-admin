import { getTaskDetail, type TaskDetail } from '@/api/admin/activity/task'
import SafeModalForm from '@/components/SafeModalForm'
import { ISchema } from '@formily/react'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

interface TableOptionsProps<T> {
  schema?: ISchema
  title?: string
  record: T extends TaskDetail ? T : never
  refreshTableList?: () => void
  onEdit?: (val: T) => void
  onDelete?: (val: T) => void
  scope?: Record<string, any> // 添加 scope 属性定义
}

const TableOptions = <T extends object>({
  schema,
  record,
  title = '',
  onEdit,
  onDelete,
  scope, // 添加 scope 参数
}: TableOptionsProps<T>) => {
  const [editRecord, setEditRecord] = useState<any | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const handleEditFinish = val => {
    const formData = typeof val === 'object' ? val : {}
    onEdit?.({
      ...formData,
      table_record: record,
    })
    setEditRecord(null)
  }

  return (
    <span>
      <Button
        type="link"
        onClick={async () => {
          if (!record?.activity_id || !record?.activity_task_id) {
            return
          }
          try {
            const res = await getTaskDetail(record?.activity_id, record?.activity_task_id)
            const formData = JSON.parse(res.extra_data)
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
          scope={scope}
          record={editRecord ?? undefined}
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
