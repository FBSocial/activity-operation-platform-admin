import { type UserLoginData } from '@/api/login';
import { getEncryptedItem, setEncryptedItem } from './encrypt';


/**
 * 获取用户信息
 * @returns 返回用户信息对象或null
 */
export const getUserInfo = (): UserLoginData | null => {
    return getEncryptedItem('userLoginData', () => {
        removeUserInfo()
        location.href = '/login'
    });
}

/**
 * 设置用户信息
 * @param userLoginData - 用户信息对象
 * @returns 是否成功设置
 */
export const setUserInfo = (userLoginData: UserLoginData): boolean => {
    return setEncryptedItem('userLoginData', userLoginData);
}



/**
 * 移除用户信息和 token，以及社区信息
 * @returns 是否成功移除
 */
export const removeUserInfo = (): boolean => {
    try {
        localStorage?.removeItem('userLoginData');
        localStorage?.removeItem('token');
        localStorage?.removeItem('guildInfo'); // 移除社区信息
        return true;
    } catch (error) {
        console.error('Error removing user info:', error);
        return false;
    }
}

/**
 * 获取当前用户的用户ID。
 *
 * @returns {string | null} 返回当前用户的用户ID，如果用户信息不存在则返回null。
 */
export const getUserId = (): string | null => {
    const userData = getUserInfo();
    return userData?.user_id || null;
}

/**
 * 设置社区信息
 * @param guildInfo - 社区信息对象
 * @returns 是否成功设置
 */
export const setGuildInfo = (guildInfo: any): boolean => {
    return setEncryptedItem('guildInfo', guildInfo);
}

/**
 * 获取社区信息
 * @returns 返回社区信息对象或null
 */
export const getGuildInfo = (): any | null => {
    return getEncryptedItem('guildInfo');
}

/**
 * 获取当前社区的社区ID。
 *
 * @returns {string | null} 返回当前社区的社区ID，如果社区信息不存在则返回null。
 */
export const getGuildId = (): string | null => {
    const guildInfo = getGuildInfo();
    return guildInfo?.guild_id || null;
}



/**
 * 设置 token
 * @param token - token 字符串
 * @returns 是否成功设置
 */
export const setToken = (token: string): boolean => {
    try {
        localStorage?.setItem('token', token);
        return true;
    } catch (error) {
        console.error('Error setting token:', error);
        return false;
    }
}

/**
 * 获取 token
 * @returns 返回 token 字符串或null
 */
export const getToken = (): string | null => {
    return localStorage?.getItem('token') || null;
}
