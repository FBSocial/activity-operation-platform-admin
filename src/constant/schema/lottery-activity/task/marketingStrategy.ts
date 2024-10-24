/**
 * 定义主枚举类型，包含四个值：分享拉新、促活留存、商业收入、游戏相关
 * @typedef {Object} MarketingStrategy
 * @property {Object} ShareAndAcquire - 分享拉新策略
 * @property {Object} ActivityAndRetention - 促活留存策略
 * @property {Object} BusinessRevenue - 商业收入策略
 * @property {Object} GameRelated - 游戏相关策略
 */
const MarketingStrategy = {
    /**
     * 分享拉新
     * @type {Object}
     * @property {string} name - 策略名称
     * @property {number} value - 策略值
     * @property {string} desc - 策略描述
     * @property {string} key - 策略键名
     */
    ShareAndAcquire: { name: '分享拉新', value: 1, desc: '通过分享活动邀请新用户参与', key: 'ShareAndAcquire' },

    /**
     * 促活留存
     * @type {Object}
     * @property {string} name - 策略名称
     * @property {number} value - 策略值
     * @property {string} desc - 策略描述
     * @property {string} key - 策略键名
     */
    ActivityAndRetention: { name: '促活留存', value: 2, desc: '通过各种活动促进用户活跃并提高留存率', key: 'ActivateAndRetain' },

    /**
     * 商业收入
     * @type {Object}
     * @property {string} name - 策略名称
     * @property {number} value - 策略值
     * @property {string} desc - 策略描述
     * @property {string} key - 策略键名
     */
    BusinessRevenue: { name: '商业收入', value: 3, desc: '通过销售商品或服务增加收入', key: 'BusinessRevenue' },

    /**
     * 游戏相关
     * @type {Object}
     * @property {string} name - 策略名称
     * @property {number} value - 策略值
     * @property {string} desc - 策略描述
     * @property {string} key - 策略键名
     */
    GameRelated: { name: '游戏相关', value: 4, desc: '与游戏相关的活动和任务', key: 'GameRelated' },
};

export { MarketingStrategy };
