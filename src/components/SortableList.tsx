import { HolderOutlined } from '@ant-design/icons'
import { closestCenter, DndContext, DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

interface SortableItemProps<T> {
  id?: UniqueIdentifier
  item: T
  index: number
  children: ((props: { item: T; index: number }) => React.ReactNode) | React.ReactElement
  handle?: React.ReactNode
  onItemClick?: (item: T, index: number) => void
  getItemId?: (item: T) => UniqueIdentifier
}

interface SortableListProps<T> {
  items: T[]
  onDragEnd?: (result: { oldIndex: number; newIndex: number }) => void
  onItemClick?: (item: T, index: number) => void
  getItemId?: (item: T) => UniqueIdentifier
  children: ((props: { item: T; index: number }) => React.ReactNode) | React.ReactElement
  handle?: React.ReactNode
}

function SortableItemComponent<T>({ item, index, children, handle, onItemClick, getItemId }: SortableItemProps<T>): JSX.Element {
  const id = getItemId ? getItemId(item) : index
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      backgroundColor: isDragging ? '#f0f0f0' : 'transparent',
    }),
    [transform, transition, isDragging]
  )

  const handleRef = useRef(handle)
  useEffect(() => {
    handleRef.current = handle
  }, [handle])

  const renderHandle = () => {
    return handleRef.current ? handleRef.current : <HolderOutlined />
  }

  const renderedChildren = useMemo(() => {
    if (typeof children === 'function') {
      return children({ item, index })
    }
    return React.cloneElement(children, { item, index })
  }, [children, item, index])

  const handleClick = useCallback(() => {
    onItemClick?.(item, index)
  }, [item, index, onItemClick])

  return (
    <div ref={setNodeRef} style={style} {...attributes} onClick={handleClick}>
      <div className="flex w-full flex-nowrap justify-start p-2">
        <div {...listeners} className="mr-2 flex w-[20px] cursor-grab items-center justify-center">
          {renderHandle()}
        </div>
        <div className="flex-grow cursor-auto px-1">{renderedChildren}</div>
      </div>
    </div>
  )
}

function SortableList<T>({ items, onDragEnd, onItemClick, getItemId, children, handle }: SortableListProps<T>): JSX.Element {
  const getUniqueId = useCallback(
    (item: T, index: number) => {
      if (getItemId) {
        return getItemId(item)
      }
      // 使用 `item-${index}` 作为默认的唯一 ID
      return `item-${index}`
    },
    [getItemId]
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item, index) => getUniqueId(item, index) === active.id)
        const newIndex = items.findIndex((item, index) => getUniqueId(item, index) === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          onDragEnd?.({ oldIndex, newIndex })
        }
      }
    },
    [items, onDragEnd, getUniqueId]
  )

  const itemIds = useMemo(() => items.map((item, index) => getUniqueId(item, index)), [items, getUniqueId])

  return (
    <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        {items.map((item, index) => {
          const id = getUniqueId(item, index)
          return (
            <SortableItemComponent key={id} item={item} index={index} onItemClick={onItemClick} getItemId={() => id} handle={handle}>
              {children}
            </SortableItemComponent>
          )
        })}
      </SortableContext>
    </DndContext>
  )
}

export default SortableList
export type { SortableItemProps, SortableListProps }
