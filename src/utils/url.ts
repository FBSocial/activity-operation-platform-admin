import { jsonToBase64 } from "./json";
import { getToken } from "./storage";

/**
 * 预览活动 URL 的生成函数
 *
 * @param {string | number} activityId - 活动的唯一标识符
 * @param {boolean} [mock=false] - 是否使用固定的测试 URL
 * @returns {string} 返回预览活动的完整 URL
 * @throws {Error} 当参数无效或环境变量未设置时抛出错误
 */
export function previewActivityUrl(activityId: string | number, mock: boolean = false): string {
    // 如果 mock 参数为 true，直接返回固定的测试 URL
    if (mock) {
        return 'https://mp-sit.fanbook.cc/subway2-team-activities/';
    }

    // 获取环境变量中的预览地址前缀
    const previewBaseUrl = import.meta.env.VITE_PREVIEW_ACTIVITY_HOST;

    // 验证 activityId
    if (typeof activityId !== 'string' && typeof activityId !== 'number') {
        throw new TypeError('活动 ID 必须是字符串或数字');
    }
    if (activityId === '' || (typeof activityId === 'number' && isNaN(activityId))) {
        throw new Error('活动 ID 不能为空或 NaN');
    }

    // 检查 previewBaseUrl 是否为空或未定义
    if (!previewBaseUrl || typeof previewBaseUrl !== 'string') {
        throw new Error('预览地址前缀未定义或无效');
    }

    // 获取并验证 token
    const token = getToken();
    if (!token || typeof token !== 'string') {
        throw new Error('无效的用户令牌');
    }

    const params = {
        mode: 'preview',
        token,
    };

    try {
        const serialParams = jsonToBase64(params);
        // 返回完整的预览 URL
        return `${previewBaseUrl}/activity/${activityId}?activityPreview=${serialParams}`;
    } catch (error) {
        throw new Error(`生成预览 URL 时发生错误: ${(error as Error).message}`);
    }
}

/**
 * 生成活动 URL 并添加查询参数
 *
 * @param {string | number} activityId - 活动的唯一标识符
 * @param {Record<string, string | number | boolean>} [params={}] - 要添加的查询参数对象（可选）
 * @param {boolean} [mock=false] - 是否使用固定的测试 URL
 * @returns {string} 返回带有查询参数的完整活动 URL
 */
export function getActivityUrl(
    activityId: string | number,
    params: Record<string, string | number | boolean> = {},
    mock: boolean = false
): string {
    // 获取基础 URL
    const baseUrl = previewActivityUrl(activityId, mock);

    // 将参数对象转换为查询字符串
    const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');

    // 如果有查询参数，则添加到 URL 中
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
