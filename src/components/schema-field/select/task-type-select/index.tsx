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
  defaultValue?: number // 添加 defaultValue 属性
}

const TaskTypeSelect: React.FC<TaskTypeSelectProps> = ({
  value,
  onChange,
  placeholder,
  options,
  defaultValue, // 添加 defaultValue 参数
}) => (
  <Select<number>
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    options={options}
    defaultValue={defaultValue} // 设置 defaultValue
  />
)

const mapTaskTypeProps = (props: any, field: any) => {
  const options = filterAndMapEnum(TaskTimeType)

  return {
    ...props,
    options,
  }
}

export default connect(TaskTypeSelect, mapProps(mapTaskTypeProps))
