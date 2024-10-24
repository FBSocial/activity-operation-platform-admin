import { TaskCount, TimeInterval } from '@/constant/schema/lottery-activity/task'
import { filterAndMapEnum } from '@/utils/array-utils'
import { connect, mapProps } from '@formily/react'
import { Select } from 'antd'
import React from 'react'

interface Option {
  label: string
  value: number
}

interface TaskFrequencySelectProps {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  options?: Option[]
  title?: string
}

/**
 * TaskFrequencySelect 组件
 * 用于选择任务频率的自定义 Select 组件
 */
const TaskFrequencySelect: React.FC<TaskFrequencySelectProps> = ({ value, onChange, placeholder, options }) => (
  <Select<number> value={value} onChange={onChange} placeholder={placeholder} options={options} />
)

/**
 * 映射 TaskFrequencySelect 组件的属性
 * @param props - 组件原始属性
 * @param field - Formily 字段对象
 * @returns 映射后的属性
 */
const mapTaskFrequencyProps = (props: any, field: any) => {
  const optionsType = field.componentProps?.optionsType || 'TimeInterval'
  const options = optionsType === 'TimeInterval' ? filterAndMapEnum(TimeInterval) : filterAndMapEnum(TaskCount)

  return {
    ...props,
    options,
    value: props.value ?? field.initialValue, // 使用 field.initialValue 作为默认值
  }
}

export default connect(TaskFrequencySelect, mapProps(mapTaskFrequencyProps))
