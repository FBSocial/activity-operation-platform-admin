import http from "@/utils/http";
import type { UserLoginData } from "../login";

/**
 * 社区数据接口
 */
export interface GuildData {
    guild_id: string; // 社区ID
    name: string; // 社区名称
    icon: string; // 社区图标
    description: string; // 社区描述
    owner_id: string; // 社区所有者ID
}

/**
 * 获取用户所属的社区列表
 * @param user_id - 用户ID
 * @returns 返回社区列表数据
 */
export function getGuildList(user_id: UserLoginData['user_id']) {
    return http<GuildData[]>({
        url: `/admin/user/guildlist/${user_id}`,
        method: 'get',
    })
}
