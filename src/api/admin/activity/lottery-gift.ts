import http from "@/utils/http";

/**
 * 配置奖品数据接口
 */
export interface ConfGiftData {
    /** 抽奖礼包配置ID */
    draw_gift_id: number;
    /** 活动ID */
    activity_id: number;
    /** 位置 */
    position: number;
    /** 类型 */
    type: GiftType;
    /** 剩余总数 */
    remain_total: number;
    /** 总数 */
    total: number;
    /** 安卓剩余总数 */
    remain_total_android: number;
    /** 安卓总数 */
    total_android: number;
    /** 机会率 */
    probability: number;
    /** 奖品详情 */
    gift: Gift;
}

/**
 * 奖品详情接口
 */
export interface Gift {
    /** 礼物ID */
    gift_id: number;
    /** 名称 */
    name: string;
    /** 图片 */
    img: string;
    /** 小图 */
    small_img: string;
    /** 类型 */
    type: number;
    /** 奖励对象 */
    gift_prize: GiftPrize[];
}


export enum GiftPrizePlatform {
    /** 全平台 */
    ALL = 0,
    /** 安卓 */
    ANDROID = 2,
    /** iOS */
    IOS = 1,
}

/**
 * 奖励对象接口
 */
interface GiftPrize {
    /** 礼物ID */
    gift_id: number;
    /** 奖励ID */
    prize_id: number;
    /** CD key 地址 */
    cd_key_url: string;
    /** 平台：2=安卓, 1=iOS, 0=全平台 */
    platform: GiftPrizePlatform;
    /** 是否道具打通：0=CD key, 1=自动发放 */
    is_auto_grant: number;
    /** 游戏道具ID */
    game_prop_id: string;
    /** 游戏ID */
    game_id: number;
}

/**
 * 获取单个活动奖品详情
 * @param {number|string} activityId - 活动ID
 * @param {number|string} drawGiftId - 抽奖礼包配置ID
 * @returns {Promise<ConfGiftData>} 单个活动奖品详情
 */
export function getConfGiftDetail(activityId: number | string, drawGiftId: number | string) {
    return http<ConfGiftData>({
        url: `/admin/gift/${activityId}/${drawGiftId}`,
        method: 'get',
    })
}

/**
 * 获取配置奖品列表
 * @param {Object} params - 请求参数
 * @param {number|string} params.activity_id - 活动ID
 * @returns {Promise<ConfGiftData[]>} 配置奖品数据数组
 */
export function getConfGiftList({ activity_id }: { activity_id: number | string }) {
    return http<ConfGiftData[]>({
        url: `/admin/gift/${activity_id}`,
        method: 'get',
    })
}


export enum GiftType {
    /** 谢谢参与 */
    THANKS = 0,
    /** 礼包 */
    GIFT = 1,
}

/**
 * 创建奖品请求参数接口
 */
interface CreateGiftParams {
    /** 活动ID */
    activity_id: number;
    /** 排序 */
    position: number;
    /** 礼包类型，0=谢谢参与，1=礼包 */
    type: GiftType;
    /** 是否自动下发，0=否，1=是 */
    is_auto_grant: number;
    /** 下发的道具ID */
    game_prop_id?: string;
    /** 下发的游戏ID */
    game_id?: number;
    /** Android 下发的游戏ID */
    game_id_android?: number;
    /** Android 下发的道具ID */
    game_prop_id_android?: string;
    /** iOS 或全平台 CD key 地址 */
    cd_key_url?: string;
    /** Android CD key 地址 */
    cd_key_url_android?: string;
    /** 礼包名称 */
    name: string;
    /** 礼包图片 */
    img: string;
    /** 礼包小图片 */
    small_img?: string;
    /** 概率 */
    probability: number;
}

/**
 * 创建奖品返回数据接口
 */
interface CreateGiftResponse {
    /** 抽奖礼包ID */
    draw_gift_id: number;
}

/**
 * 创建奖品
 * @param {CreateGiftParams} params - 创建奖品请求参数
 * @returns {Promise<CreateGiftResponse>} 创建奖品返回数据
 */
export function createGift(params: CreateGiftParams) {
    return http<CreateGiftResponse>({
        url: `/admin/gift/create`,
        method: 'post',
        data: params,
    })
}


/**
 * 抽奖区保存参数接口
 */
interface SaveLotteryRegionParams {
    /** 抽奖区背景图 */
    draw_img: string;
    /** 抽奖按钮图片 */
    draw_button_img: string;
    /** 抽奖按钮文字 */
    draw_button_txt: string;
    /** 抽奖次数 */
    draw_num: number;
    /** 礼包数组 */
    draw_gift_array: number[];
}

/**
 * 抽奖区保存
 * @param {number} activityId - 活动ID
 * @param {SaveLotteryRegionParams} params - 保存抽奖区请求参数
 * @returns {Promise<void>} 保存抽奖区响应
 */
export function saveLotteryRegion(activityId: number | string, params: SaveLotteryRegionParams): Promise<void> {
    return http({
        url: `/admin/gift/${activityId}/region/save`,
        method: 'put',
        data: params,
    });
}



/**
 * 礼包保存参数接口
 */
export interface SaveGiftParams {
    /** 排序 */
    position: number;
    /** 礼包类型，0=谢谢参与，1=礼包 */
    type: number;
    /** 机率 */
    probability: string;
    /** 礼品对象 */
    gift?: {
        gift_id: number;
        name: string;
        img: string;
        type: number;
        gift_prize: Array<{
            cd_key_url: string;
            prize_id: number;
            gift_id: number;
            platform: number;
            is_auto_grant: number;
        }>;
    };
}

/**
 * 礼包保存响应接口
 */
interface SaveGiftResponse {
    draw_gift_id: number;
    draw_id: number;
    gift_id: number;
    activity_id: number;
    position: number;
    type: number;
    remain_total: number;
    total: number;
    remain_total_android: number;
    total_android: number;
    probability: number;
    gift: {
        gift_id: number;
        name: string;
        img: string;
        small_img: string;
        type: number;
        gift_prize: Array<{
            gift_id: number;
            prize_id: number;
            cd_key_url: string;
            platform: number;
            is_auto_grant: number;
            game_prop_id: string;
            game_id: number;
        }>;
    };
}

/**
 * 礼包保存
 * @param {number} activityId - 活动ID
 * @param {number} drawGiftId - 抽奖礼包ID
 * @param {SaveGiftParams} params - 保存礼包请求参数
 * @returns {Promise<SaveGiftResponse>} 保存礼包响应
 */
export function saveGift(activityId: number, drawGiftId: number, params: SaveGiftParams): Promise<SaveGiftResponse> {
    return http<SaveGiftResponse>({
        url: `/admin/gift/${activityId}/${drawGiftId}`,
        method: 'put',
        data: params,
    });
}
