import type { GuildData } from '@/api/admin'
import { useUserGuilds } from '@/hooks/useUserGuilds'
import { Avatar, Select, Space, type SelectProps } from 'antd'
import type { LabeledValue } from 'antd/es/select'
import React, { useCallback, useMemo } from 'react'

/**
 * GuildSelect 组件的属性类型
 * @typedef {Object} GuildSelectProps
 * @property {(value: string, option: any, item: GuildData | undefined) => void} [onChange] - 选择变更时的回调函数
 * @property {(value: string | number | LabeledValue, option: any, item: GuildData | undefined) => void} [onSelect] - 选择某项时的回调函数
 */
type GuildSelectProps = Omit<SelectProps, 'options' | 'labelRender' | 'onChange' | 'onSelect'> & {
  onChange?: (value: string, option: any, item: GuildData | undefined) => void
  onSelect?: (value: string | number | LabeledValue, option: any, item: GuildData | undefined) => void
}

/**
 * GuildSelect 组件
 * 用于选择用户所属的公会
 * @param {GuildSelectProps} props - 组件属性
 * @returns {React.ReactElement} GuildSelect 组件
 */
const GuildSelect: React.FC<GuildSelectProps> = props => {
  const { guilds, loading } = useUserGuilds()
  const { onChange, onSelect, ...restProps } = props

  /**
   * 渲染选中项的标签
   * @param {Object} labelProps - 标签属性
   * @returns {React.ReactNode} 渲染后的标签
   */
  const labelRender: SelectProps['labelRender'] = useCallback(
    labelProps => {
      const { value } = labelProps
      const guild = guilds.find(g => g.guild_id === value)

      if (!guild) return labelProps.label

      return (
        <Space>
          <Avatar src={guild.icon} size={24} />
          <span>{guild.name}</span>
        </Space>
      )
    },
    [guilds]
  )

  /**
   * 渲染选项
   * @param {Object} option - 选项属性
   * @returns {React.ReactNode} 渲染后的选项
   */
  const optionRender = useCallback(
    (option: any) => {
      const { value } = option
      const guild = guilds.find(g => g.guild_id === value)
      if (!guild) return option.value
      return (
        <Space>
          <Avatar src={guild.icon} size={24} />
          <span>{guild.name}</span>
        </Space>
      )
    },
    [guilds]
  )

  /**
   * 生成选项列表
   */
  const options = useMemo(() => {
    if (!Array.isArray(guilds) || guilds.length === 0) return []
    return guilds.map(item => ({
      label: item.name,
      value: item.guild_id,
    }))
  }, [guilds])

  /**
   * 处理选择变更
   * @param {any} value - 选中的值
   * @param {any} option - 选中的选项
   */
  const handleChange = useCallback(
    (value: any, option: any) => {
      const selectedGuild = guilds.find(g => g.guild_id === value.value)
      onChange?.(value, option, selectedGuild)
    },
    [guilds, onChange]
  )

  /**
   * 处理选择某项
   * @param {string | number | LabeledValue} value - 选中的值
   * @param {any} option - 选中的选项
   */
  const handleSelect = useCallback(
    (value: string | number | LabeledValue, option: any) => {
      const selectedGuild = guilds.find(g => g.guild_id === value)
      onSelect?.(value, option, selectedGuild)
    },
    [guilds, onSelect]
  )

  return (
    <Select
      options={options}
      placeholder="请选择社区"
      labelInValue
      optionLabelProp="label"
      labelRender={labelRender}
      optionRender={optionRender}
      showSearch
      filterOption={(input, option) =>
        (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ||
        (option?.value as string)?.toLowerCase().includes(input.toLowerCase())
      }
      loading={loading || restProps.loading}
      onChange={handleChange}
      onSelect={handleSelect}
      {...restProps}
    />
  )
}

export default GuildSelect
