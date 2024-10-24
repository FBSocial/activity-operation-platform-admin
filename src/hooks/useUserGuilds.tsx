import { getGuildList, type GuildData } from '@/api/admin'
import { getUserId } from '@/utils/storage'
import { useEffect, useState } from 'react'

/**
 * 自定义 Hook，用于获取当前登录用户拥有的社区列表。
 *
 * @returns {Object} 包含社区列表和加载状态的对象。
 * @property {GuildData[] | []} guilds - 当前登录用户拥有的社区列表。
 * @property {boolean} loading - 是否正在加载社区列表。
 */
export function useUserGuilds() {
  const [guilds, setGuilds] = useState<GuildData[] | []>([])
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * 异步函数，用于获取当前登录用户的社区列表。
   *
   * @throws {Error} 如果获取社区列表失败，抛出错误。
   */
  const fetchUserGuilds = async () => {
    try {
      setLoading(true) // 开始加载

      const userId = getUserId()
      if (!userId) {
        throw new Error('User ID is not available')
      }

      const data = await getGuildList(userId)
      if (!data) {
        throw new Error(`Failed to fetch guild list with code: ${data}`)
      }

      setGuilds(data)
    } catch (error) {
      console.error('Failed to fetch user guilds:', error)
      // 可以在这里添加一个错误提示给用户
    } finally {
      setLoading(false) // 结束加载
    }
  }

  useEffect(() => {
    fetchUserGuilds()
  }, [])

  return { guilds, loading }
}
