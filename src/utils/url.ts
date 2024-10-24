import { jsonToBase64 } from "./json";
import { getToken } from "./storage";


/**
 * 生成带有编码参数的 URL
 * @param {string} baseUrl - 基础 URL
 * @param {Record<string, string | number | boolean>} [params] - 可选的参数对象
 * @returns {string} 完整的编码 URL
 * @throws {Error} 当 baseUrl 无效时抛出错误
 */
function generateEncodedUrl(baseUrl: string, params?: Record<string, string | number | boolean>): string {
    // 验证 baseUrl
    if (typeof baseUrl !== 'string' || baseUrl.trim() === '') {
        throw new Error('基础 URL 必须是非空字符串');
    }

    // 如果没有参数或参数为空对象，直接返回 baseUrl
    if (!params || Object.keys(params).length === 0) {
        return baseUrl;
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
        }
    }

    const queryString = searchParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}


/**
 * 获取活动页面的基础 URL
 *
 * @param {string | number} activityId - 活动的唯一标识符
 * @param {boolean} [mock=false] - 是否使用固定的测试 URL
 * @returns {string} 返回活动页面的基础 URL
 * @throws {Error} 当参数无效或环境变量未设置时抛出错误
 */
export function getActivityBaseUrl(activityId: string | number, mock: boolean = false): string {
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

    // 返回基础 URL
    return `${previewBaseUrl}/activity/${activityId}`;
}

/**
 * 预览活动 URL 的生成函数
 *
 * @param {string | number} activityId - 活动的唯一标识符
 * @param {boolean} [mock=false] - 是否使用固定的测试 URL
 * @returns {string} 返回预览活动的完整 URL
 * @throws {Error} 当参数无效或环境变量未设置时抛出错误
 */
export function previewActivityUrl(activityId: string | number, mock: boolean = false): string {
    const baseUrl = getActivityBaseUrl(activityId, mock);

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
        return `${baseUrl}?fbpvm=${serialParams}`;
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
    const baseUrl = getActivityBaseUrl(activityId, mock);

    // 使用 generateEncodedUrl 函数生成带有查询参数的 URL
    return generateEncodedUrl(baseUrl, params);
}

/**
 * 生成带有加密数据的 URL
 *
 * @param {string} baseUrl - 基础 URL
 * @param {string} path - URL 路径
 * @param {Record<string, unknown>} encryptedData - 需要加密的数据对象
 * @param {string} [encryptedParamName='encryptedData'] - 加密数据在 URL 中的参数名
 * @returns {string} 返回带有加密数据的完整 URL
 * @throws {Error} 当参数无效或加密过程出错时抛出错误
 */
export function generateEncryptedUrl(
    baseUrl: string,
    path: string,
    encryptedData: Record<string, unknown>,
    encryptedParamName: string = 'encryptedData'
): string {
    // 验证 baseUrl
    if (!baseUrl || typeof baseUrl !== 'string') {
        throw new Error('基础 URL 不能为空且必须是字符串');
    }

    // 验证 path
    if (typeof path !== 'string') {
        throw new TypeError('路径必须是字符串');
    }

    // 验证 encryptedData
    if (typeof encryptedData !== 'object' || encryptedData === null) {
        throw new TypeError('加密数据必须是一个对象');
    }

    // 验证 encryptedParamName
    if (typeof encryptedParamName !== 'string' || encryptedParamName.trim() === '') {
        throw new Error('加密参数名必须是非空字符串');
    }

    try {
        // 使用 jsonToBase64 加密数据
        const serializedData = jsonToBase64(encryptedData);

        // 构建 URL
        const url = new URL(path, baseUrl);
        url.searchParams.append(encryptedParamName, serializedData);

        return url.toString();
    } catch (error) {
        throw new Error(`生成加密 URL 时发生错误: ${(error as Error).message}`);
    }
}

/**
 * 生成带有加密数据的预览活动 URL
 *
 * @param {string | number} activityId - 活动的唯一标识符
 * @param {Record<string, unknown>} [encryptData={}] - 需要加密的对象数据
 * @returns {string} 返回带有加密数据的预览活动完整 URL
 * @throws {Error} 当参数无效或环境变量未设置时抛出错误
 */
export function previewEncryptActivityUrl(
    activityId: string | number,
    encryptData: Record<string, unknown> = {}
): string {
    const baseUrl = getActivityBaseUrl(activityId);

    // 获取并验证 token
    const token = getToken();
    if (!token || typeof token !== 'string') {
        throw new Error('无效的用户令牌');
    }

    const params = {
        mode: 'preview',
        ...encryptData // 将加密数据合并到参数中
    };

    try {
        const serialParams = jsonToBase64(params);
        // 返回完整的预览 URL，包含加密数据
        return `${baseUrl}?fbpvm=${serialParams}`;
    } catch (error) {
        throw new Error(`生成带加密数据的预览 URL 时发生错误: ${(error as Error).message}`);
    }
}
