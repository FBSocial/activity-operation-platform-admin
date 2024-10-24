import http from "@/utils/http";
import type { ActivityListItemData } from ".";

/**
 * 锁定活动请求参数接口
 */
interface LockActivityParams {
    /** 活动ID */
    activity_id: number | string | undefined;
}



/**
 * 锁定活动
 * @param {LockActivityParams} params - 锁定活动请求参数
 * @returns {Promise<LockActivityResponse>} 锁定活动返回数据
 */
export function lockActivity({ activity_id }: LockActivityParams) {
    return http<Pick<ActivityListItemData, 'activity_id'>>({
        url: `/admin/activity/lock/${activity_id}`,
        method: 'put',
    })
}

/**
 * 解锁活动请求参数接口
 */
interface UnlockActivityParams {
    /** 活动ID */
    activity_id: number | string | undefined;
}

/**
 * 解锁活动返回数据接口
 */
interface UnlockActivityResponse {
    /** 是否成功 */
    success: boolean;
    /** 消息 */
    message: string;
}

/**
 * 解锁活动
 * @param {UnlockActivityParams} params - 解锁活动请求参数
 * @returns {Promise<UnlockActivityResponse>} 解锁活动返回数据
 */
export function unlockActivity({ activity_id }: UnlockActivityParams) {
    return http<UnlockActivityResponse>({
        url: `/admin/activity/lock/clean/${activity_id}`,
        method: 'delete',
    })
}