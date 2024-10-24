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
  /** 数据类型，'channels' 表示所有频道，'textChannels' 表示文本频道，'questionChannels' 表示问答频道，'tag' 表示标签 */
  type?: 'channels' | 'textChannels' | 'questionChannels' | 'tag'
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

    const { channels, textChannels, questionChannels, tags, loading, fetchGuildData, error } = contextData

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

    /**
     * 根据类型获取对应的选项
     * @param type 数据类型
     * @returns 选项数组
     */
    const getOptions = (type: GuildDataSelectProps['type']) => {
      switch (type) {
        case 'channels':
          return channels?.map(channel => ({ label: channel.name, value: channel.channel_id }))
        case 'textChannels':
          return textChannels?.map(channel => ({ label: channel.name, value: channel.channel_id }))
        case 'questionChannels':
          return questionChannels?.map(channel => ({ label: channel.name, value: channel.channel_id }))
        case 'tag':
          return tags?.map(tag => ({ label: tag.tag_name, value: tag.tag_id }))
        default:
          return []
      }
    }

    const options = getOptions(props.type)

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
