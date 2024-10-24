/**
 * 活动状态枚举
 */
export enum ActivityStatus {
    NotStarted = 0, // 活动未上线
    Started = 1,    // 活动已上线
    Ended = 2,      // 活动已结束
    Delete = 3,      // 活动被删除
}

/**
 * 获取活动状态的描述
 * @param status - 活动状态
 * @returns 返回活动状态的描述
 */
export function getActivityStatusDescription(status: ActivityStatus): string {
    switch (status) {
        case ActivityStatus.NotStarted:
            return '活动未上线';
        case ActivityStatus.Started:
            return '活动已上线';
        case ActivityStatus.Ended:
            return '活动已结束';
        default:
            return '未知状态';
    }
}

