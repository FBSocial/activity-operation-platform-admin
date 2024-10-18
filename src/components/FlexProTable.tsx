import { ParamsType, ProTable, ProTableProps } from '@ant-design/pro-components'
import React from 'react'

/**
 * FlexProTable 组件
 *
 * 这个组件是对 ProTable 的封装，添加了自动高度调整的功能。
 *
 * @template DataType - 表格数据类型
 * @template Params - 参数类型，默认为 ParamsType
 * @template ValueType - 值类型，默认为 'text'
 *
 * @param {ProTableProps<DataType, Params, ValueType>} props - ProTable 的属性
 * @returns {React.ReactElement} 返回一个 React 元素
 */
export function FlexProTable<DataType extends Record<string, any>, Params extends ParamsType = ParamsType, ValueType = 'text'>({
  scroll = { y: '100%' },
  className = '',
  rowKey,
  ...props
}: ProTableProps<DataType, Params, ValueType>): React.ReactElement {
  return (
    <ProTable<DataType, Params, ValueType>
      {...props}
      className={` ${className}`}
      scroll={{ ...scroll, y: '100%', x: 'max-content' }}
      rowKey={rowKey || 'id'} // 确保每行都有唯一的 key
    />
  )
}
