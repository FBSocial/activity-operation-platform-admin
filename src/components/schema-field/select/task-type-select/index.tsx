import { TaskTimeType } from '@/constant/schema/lottery-activity/task/time'
import { filterAndMapEnum } from '@/utils/array-utils'
import { connect, mapProps } from '@formily/react'
import { Select } from 'antd'
import React from 'react'

interface Option {
  label: string
  value: number
}

interface TaskTypeSelectProps {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  options?: Option[]
  title?: string
}

/**
 * TaskTypeSelect 组件
 * 用于选择任务类型的自定义 Select 组件
 */
const TaskTypeSelect: React.FC<TaskTypeSelectProps> = ({ value, onChange, placeholder, options }) => (
  <Select<number> value={value} onChange={onChange} placeholder={placeholder} options={options} />
)

/**
 * 映射 TaskTypeSelect 组件的属性
 * @param props - 组件原始属性
 * @param field - Formily 字段对象
 * @returns 映射后的属性
 */
const mapTaskTypeProps = (props: any, field: any) => {
  const options = filterAndMapEnum(TaskTimeType)

  return {
    ...props,
    options,
    value: props.value ?? field.initialValue, // 使用 field.initialValue 作为默认值
  }
}

export default connect(TaskTypeSelect, mapProps(mapTaskTypeProps))
