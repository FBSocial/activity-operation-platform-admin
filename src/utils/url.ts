/**
 * 预览活动 URL 的生成函数
 *
 * @param {string} activityId - 活动的唯一标识符
 * @param {boolean} [mock=false] - 是否使用固定的测试 URL
 * @returns {string} 返回预览活动的完整 URL
 */
export function previewActivityUrl(activityId: string, mock: boolean = false): string {
    // 如果 mock 参数为 true，直接返回固定的测试 URL
    if (mock) {
        return 'https://mp-sit.fanbook.cc/subway2-team-activities/';
    }

    // 获取环境变量中的预览地址前缀
    const previewBaseUrl = import.meta.env.VITE_PREVIEW_ACTIVITY_HOST;

    // 检查 activityId 是否为空或未定义
    if (!activityId) {
        throw new Error('活动 ID 不能为空');
    }

    // 检查 previewBaseUrl 是否为空或未定义
    if (!previewBaseUrl) {
        throw new Error('预览地址前缀未定义');
    }

    // 返回完整的预览 URL
    return `${previewBaseUrl}/activity/${activityId}`;
}