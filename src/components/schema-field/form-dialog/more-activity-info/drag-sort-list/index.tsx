import SortableList, { type SortableItemProps } from '@/components/SortableList'
import { Card } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import SortListItem from './SortListItem'

interface data {
  banner: string
  url: string
  id: number
}

interface DragSortListProps<T> {
  items: SortableItemProps<T>[]
  onDragendChange?: (value: { oldIndex: number; newIndex: number }) => void
  onActionChange?: (value: any, index?: number) => void
}

type SortItemsType = Required<DragSortListProps<data>['items']>

const DragSortList = ({ items, onDragendChange, onActionChange }: DragSortListProps<data>) => {
  const [sortItems, setSortItems] = useState<SortItemsType>([])

  useEffect(() => {
    if (Array.isArray(items)) {
      setSortItems(items)
    }
  }, [items])

  const handleSortItemActions = useCallback(
    (data: any, index: number) => {
      onActionChange?.(data, index)
    },
    [onActionChange]
  )

  const renderEmpty = useMemo(() => {
    if (!items || (Array.isArray(items) && items.length === 0)) {
      return true
    }
    return false
  }, [items])

  const handleDragEnd = useCallback(
    (values: { oldIndex: number; newIndex: number }) => {
      setSortItems(prevItems => {
        const newItems = [...prevItems]
        const [reorderedItem] = newItems.splice(values.oldIndex, 1)
        newItems.splice(values.newIndex, 0, reorderedItem)
        return newItems
      })
      onDragendChange?.(values)
      onActionChange?.({
        type: 'move',
        ...values,
      })
    },
    [onDragendChange, onActionChange]
  )

  return (
    <>
      {!renderEmpty && (
        <Card className="max-h-[650px] w-[450px] overflow-auto" size="small" bordered={false}>
          <SortableList items={sortItems} onDragEnd={handleDragEnd}>
            {({ item, index }) => <SortListItem dataSource={item} onClick={data => handleSortItemActions(data, index)} />}
          </SortableList>
        </Card>
      )}
    </>
  )
}

export default DragSortList
