import { ISchema } from '@formily/react'
import { Button, Popconfirm } from 'antd'
import SafeModalForm from './SafeModalForm'

interface TableOptionsProps<T> {
  schema?: ISchema
  title?: string
  record: T
  onEdit?: (val: T) => void
  onDelete?: (val: T) => void
}

const TableOptions = <T extends object>({ schema, record, title = '', onEdit, onDelete }: TableOptionsProps<T>) => {
  return (
    <span>
      {onEdit && schema && (
        <SafeModalForm title={title} schema={schema} record={record} onFinish={onEdit} trigger={<Button type="link">编辑</Button>} />
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
