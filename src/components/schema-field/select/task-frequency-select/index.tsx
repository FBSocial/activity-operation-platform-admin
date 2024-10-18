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
  defaultValue?: number // 新增 defaultValue 属性
}

const TaskFrequencySelect: React.FC<TaskFrequencySelectProps> = ({ value, onChange, placeholder, options, defaultValue }) => (
  <Select<number>
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    options={options}
    defaultValue={defaultValue} // 添加 defaultValue 属性
  />
)

const mapTaskFrequencyProps = (props: any, field: any) => {
  const optionsType = field.componentProps?.optionsType || 'TimeInterval'
  const options = optionsType === 'TimeInterval' ? filterAndMapEnum(TimeInterval) : filterAndMapEnum(TaskCount)

  return {
    ...props,
    options,
  }
}

export default connect(TaskFrequencySelect, mapProps(mapTaskFrequencyProps))
