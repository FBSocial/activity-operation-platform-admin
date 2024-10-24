import { TaskRewardCount } from '@/constant/schema/lottery-activity/task'
import { filterAndMapEnum } from '@/utils/array-utils'
import { connect, mapProps } from '@formily/react'
import { Select } from 'antd'
import React from 'react'

/**
 * 选项接口定义
 */
interface Option {
  label: string
  value: string
}

/**
 * TaskRewardCountSelect 组件属性接口
 */
interface TaskRewardCountSelectProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  options?: Option[]
  title?: string
  default?: string // 添加 default 属性
}

/**
 * 任务奖励次数选择组件
 * @param props 组件属性
 * @returns 任务奖励次数选择组件
 */
const TaskRewardCountSelect: React.FC<TaskRewardCountSelectProps> = ({
  value,
  onChange,
  placeholder,
  options,
  default: defaultValue, // 添加 default 属性
}) => (
  <Select<string>
    value={value || defaultValue} // 使用 value 或 defaultValue
    onChange={onChange}
    placeholder={placeholder}
    options={options}
  />
)

/**
 * 映射任务奖励次数选择组件属性
 * @param props 原始属性
 * @param field Formily 字段对象
 * @returns 映射后的属性
 */
const mapTaskRewardCountProps = (props: any, field: any) => {
  const options = filterAndMapEnum(TaskRewardCount)
  return {
    ...props,
    options,
  }
}

export default connect(TaskRewardCountSelect, mapProps(mapTaskRewardCountProps))
