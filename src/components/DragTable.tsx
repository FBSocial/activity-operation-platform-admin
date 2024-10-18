import { HolderOutlined } from '@ant-design/icons'
import { ProColumns, ProTableProps } from '@ant-design/pro-components'
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Typography } from 'antd'
import React, { useMemo } from 'react'
import { FlexProTable } from './FlexProTable'

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string
}

const Row = (props: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  })

  const { children, ...restProps } = props

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative' } : {}),
  }

  return (
    <tr {...restProps} ref={setNodeRef} {...attributes} style={style}>
      {React.Children.map(children, child => {
        if (child && React.isValidElement(child) && child?.key === 'dnd-kit-sort') {
          return React.cloneElement(child, {
            className: '!cursor-move',
            additionalProps: { ...listeners, 'data-cypress': 'draggable-handle' },
          } as any)
        }
        return child
      })}
    </tr>
  )
}

interface DragTableProps<DataType extends Record<string, any>> extends ProTableProps<DataType, any> {
  setDataSource?: (val: DataType[] | ((prevState: DataType[]) => DataType[])) => void
  onDragEnd?: (activeId: UniqueIdentifier, overId?: UniqueIdentifier) => void
  sortRequestData?: (val: DataType[]) => void
  requestSort?: (a: DataType, b: DataType) => number
  rowKey?: keyof DataType
  message?: string
}

export function move<DataType extends Record<string, any>>(
  data: DataType[],
  rowKey: keyof DataType,
  activeId: UniqueIdentifier,
  overId?: UniqueIdentifier
) {
  if (activeId !== overId && overId !== undefined) {
    const activeIndex = data.findIndex(i => i[rowKey] === activeId)
    const overIndex = data.findIndex(i => i[rowKey] === overId)

    return arrayMove([...data], activeIndex, overIndex) as DataType[]
  }
  return data
}

function DragTable<DataType extends Record<string, any>>({
  dataSource,
  setDataSource,
  onDragEnd,
  search = false,
  rowKey = 'id' as keyof DataType,
  message = '可拖拽调整展示顺序',
  columns,
  request,
  requestSort,
  sortRequestData,
  ...props
}: DragTableProps<DataType>) {
  const [dragData, setDragData] = React.useState<DataType[]>([])
  const dragTableData = request ? dragData?.sort(requestSort ? requestSort : (a, b) => a['sort'] - b['sort']) : dataSource

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const sortData = (data: DataType[]) => move(data, rowKey, active.id, over?.id)
    setDataSource?.(sortData)

    onDragEnd?.(active.id, over?.id)
    // request 排序
    sortRequestData?.(sortData(dragData))
    setDragData?.(
      sortData(dragData).map((item, index) => ({
        ...item,
        sort: index,
      }))
    )
  }

  const _columns = useMemo(
    () => [
      {
        title: '拖动排序',
        dataIndex: 'dnd-kit-sort',
        width: 80,
        render: () => <HolderOutlined />,
        align: 'center',
      } as ProColumns,
      ...(columns ?? []),
    ],
    [columns]
  )

  return (
    <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
      <Typography.Text type="secondary">{message}</Typography.Text>
      <SortableContext
        // rowKey array
        items={dragTableData?.map(i => i[rowKey]) ?? []}
        strategy={verticalListSortingStrategy}
      >
        <FlexProTable<DataType>
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey={rowKey}
          columns={_columns}
          dataSource={dragTableData}
          search={search}
          request={
            request ?
              (...requestProps) => {
                return request?.(...requestProps).then(res => {
                  setDragData(res.data || [])
                  return res
                })
              }
            : undefined
          }
          {...props}
        />
      </SortableContext>
    </DndContext>
  )
}

export default DragTable
