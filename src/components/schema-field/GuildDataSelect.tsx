import { useGuildData } from '@/contexts/GuildDataContext'
import { connect, mapProps } from '@formily/react'
import { DefaultOptionType } from 'antd/es/select'
import Select, { SelectProps } from 'antd/lib/select'
import { useEffect } from 'react'

/**
 * GuildDataSelect 组件属性接口
 * @interface GuildDataSelectProps
 * @extends {SelectProps}
 */
interface GuildDataSelectProps extends SelectProps {
  /** 公会ID，可选 */
  guildId?: string
  /** 数据类型，'channel' 表示频道，其他值表示标签 */
  type?: 'channel' | 'tag'
}

/**
 * GuildDataSelect 组件
 * 用于选择公会相关的频道或标签数据
 */
const GuildDataSelect = connect(
  Select,
  mapProps((props: GuildDataSelectProps, field) => {
    let contextData
    try {
      contextData = useGuildData()
    } catch (error) {
      console.error('使用 GuildData 上下文失败:', error)
      return {
        ...props,
        loading: false,
        options: [],
        disabled: true,
      }
    }

    const { channels, tags, loading, fetchGuildData, error } = contextData

    useEffect(() => {
      if (props.guildId) {
        fetchGuildData(props.guildId).catch(err => {
          console.error('获取公会数据失败:', err)
          // 这里可以添加额外的错误处理逻辑，比如显示错误消息
        })
      }
    }, [props.guildId, fetchGuildData])

    if (error) {
      console.error('GuildData 上下文出错:', error)
      return {
        ...props,
        loading: false,
        options: [],
        disabled: true,
      }
    }

    const options =
      props.type === 'channel' ?
        channels?.map(channel => ({ label: channel.name, value: channel.channel_id }))
      : tags.map(tag => ({ label: tag.tag_name, value: tag.tag_id }))

    // 如果没有传递 formily defaultValue，则默认选择第一个值

    return {
      ...props,
      loading,
      options,
      showSearch: true, // 默认启用搜索功能
      filterOption: (input: string, option?: DefaultOptionType) => (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase()),
    }
  })
)

export default GuildDataSelect
