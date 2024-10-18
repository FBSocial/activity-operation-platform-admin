import http from '@/utils/http';

/**
 * 短信数据接口
 */
interface SmSData {
    message: string;
    code: number;
    data: [];
}

/**
 * 登录数据接口
 */
export interface UserLoginData {
    admin_role_id: string;
    user_id: string;
    avatar: string;
    avatar_nft: string;
    username: string;
    mobile: string;
    joined_at: number;
    email: null;
    gender: number;
    presence_status: number;
    discriminator: string;
    nickname: string;
    ban_type: number;
    level: number;
    integral: number;
    sign: string;
    expire_time: number;
    area_code: number;
}

/**
 * 发送短信验证码
 * @param params - 包含手机号和区号的参数对象
 * @param params.mobile - 手机号
 * @param params.area_code - 区号
 * @returns 返回短信数据
 */
export function sendSms(params: { mobile: string, area_code: string }) {
    return http<SmSData>({
        url: '/common/user/sms',
        method: 'post',
        params: params
    })
}

/**
 * 手机号登录
 * @param params - 包含手机号、验证码和区号的参数对象
 * @param params.mobile - 手机号
 * @param params.code - 验证码
 * @param params.area_code - 区号
 * @returns 返回登录数据
 */
export function phoneLogin(params: { mobile: string, code: string, area_code: string }) {
    return http<UserLoginData>({
        url: '/common/user/adlogin',
        method: 'post',
        params: params
    })
}