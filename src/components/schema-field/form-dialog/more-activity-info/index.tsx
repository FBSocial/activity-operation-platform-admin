import type { SortableItemProps } from '@/components/SortableList'
import { PlusOutlined } from '@ant-design/icons'
import { arrayMove } from '@dnd-kit/sortable'
import type { Field } from '@formily/core'
import { observer, useField } from '@formily/react'
import { Button, Space, Tooltip } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import DragSortList from './drag-sort-list'
import FormModal from './FormModal'
import { moreActivityList } from './schema'

// 定义组件的Props接口
interface ConfigurableShareFieldProps {
  buttonName?: string
  value?: Record<string, unknown>[]
  readOnly: boolean
  disabled: boolean
  showTooltip?: boolean

  onChange?: (values: Record<string, any>) => void
}

// 使用observer包装组件，使其能够响应Formily的表单状态变化
const ConfigurableMoreActivityInfo = observer(({ value, buttonName, onChange, showTooltip, disabled, readOnly }: ConfigurableShareFieldProps) => {
  // 使用Formily的useField钩子获取当前字段
  const field = useField<Field>()
  const [items, setItems] = useState<SortableItemProps<any>[]>([])

  const [modalVisible, setModalVisible] = useState(false)

  const [itemData, setItemData] = useState<any>({})
  const [formStatusType, setFormStatusType] = useState<'add' | 'edit'>('add')

  // 初始化值的填充
  useEffect(() => {
    if (Array.isArray(value)) {
      setItems(value as any)
      field.setValue(value)
    }
  }, [value, field])

  // 打开配置Modal:新增
  const handleOpenModalAdd = () => {
    setFormStatusType('add')
    setItemData({})
    setModalVisible(true)
  }

  // 保存配置
  const handleSaveConfig = useCallback(
    (values: any) => {
      let newItems: any[]
      if (formStatusType === 'add') {
        newItems = [...items, values]
      } else if (formStatusType === 'edit') {
        newItems = items.map(item => (item.id === values.id ? values : item))
      } else {
        newItems = items
      }
      setItems(newItems)
      field.setValue(newItems)
      onChange?.(newItems)
      setModalVisible(false)
    },
    [formStatusType, items, field, onChange]
  )
  // 处理拖拽排序列表的变更
  const handleSortItemChange = useCallback(
    (values: Record<string, any>, index?: number) => {
      let newItems: any[]
      if (values.type === 'remove') {
        newItems = items.filter((item: any, itemIndex: number) => itemIndex !== index)
      } else if (values.type === 'edit') {
        setFormStatusType('edit')
        setItemData(values)
        setModalVisible(true)
        return // 编辑不直接修改items，而是通过modal修改
      } else if (values.type === 'move') {
        newItems = arrayMove(items, values.oldIndex, values.newIndex)
      } else {
        return // 如果是未知类型，不做任何操作
      }
      setItems(newItems)
      field.setValue(newItems)
      onChange?.(newItems)
    },
    [items, field, onChange]
  )

  const disabledAddTask = useMemo(() => {
    return disabled || readOnly || items.length >= 3
  }, [items, disabled, readOnly])

  return (
    <>
      <Space direction="vertical">
        <div>
          <Space>
            <Tooltip title={showTooltip ? (field.description ?? '') : ''} placement="bottom">
              <Button type="default" onClick={handleOpenModalAdd} icon={<PlusOutlined />} disabled={disabledAddTask}>
                {buttonName || '配置'}
              </Button>
            </Tooltip>
            <Space>
              <span>已添加(最多3个):</span>
              <span>{items?.length}</span>
            </Space>
          </Space>
        </div>

        <DragSortList items={items} onActionChange={handleSortItemChange} />
      </Space>
      <FormModal
        schema={moreActivityList}
        formStatusType={formStatusType}
        visible={modalVisible}
        title={field.title}
        onOk={handleSaveConfig}
        formData={itemData}
        onCancel={() => setModalVisible(false)}
      />
    </>
  )
})

export default ConfigurableMoreActivityInfo
