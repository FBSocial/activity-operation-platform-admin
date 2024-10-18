import { type GuildData } from '@/api/admin'
import { useUserGuilds } from '@/hooks/useUserGuilds'
import { setGuildInfo } from '@/utils/storage'
import { ProCard } from '@ant-design/pro-components'
import { useNavigate } from 'react-router-dom'
import GuildListCard from './GuildListCard'

export default function SelectGuild() {
  const { guilds, loading } = useUserGuilds()
  const navigate = useNavigate()

  const handleClick = (item: GuildData) => {
    setGuildInfo(item)
    navigate('/admin/lottery-activity/list', { state: { key: new Date().getTime() } })
  }

  return (
    <div className="select-guild fixed left-0 top-0 z-10 h-screen w-screen bg-white">
      <ProCard title="活动运营平台" headerBordered className="h-full">
        <div className="flex h-full w-full items-center justify-center">
          <div className="w-[600px]">
            <GuildListCard loading={loading} listData={guilds} onClick={handleClick} />
          </div>
        </div>
      </ProCard>
    </div>
  )
}
