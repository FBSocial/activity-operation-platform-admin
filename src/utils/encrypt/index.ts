import CryptoJS from 'crypto-js';

// 加密密钥（建议从环境变量中获取）
const encryptionKey = import.meta.env.VITE_LOCAL_STORAGE_ENCRYPTION_KEY || 'fallback-key';

/**
 * 加密数据
 * @param data - 要加密的数据
 * @returns 加密后的数据
 */
export const encryptData = (data: any): string => {
    try {
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        return CryptoJS.AES.encrypt(dataString, encryptionKey).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt data');
    }
};

/**
 * 解密数据
 * @param encryptedData - 要解密的数据
 * @returns 解密后的数据或null（如果解密失败）
 */
export const decryptData = (encryptedData: string): any | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
        const decryptedDataString = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedDataString) {
            throw new Error('Decryption resulted in empty string');
        }
        return JSON.parse(decryptedDataString);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};



/**
 * 设置加密的 localStorage 项
 * @param key - 存储项的键
 * @param value - 存储项的值，可以是任何可以被 JSON.stringify 的对象
 * @returns 是否成功设置
 */
export const setEncryptedItem = (key: string, value: any): boolean => {
    try {
        const encryptedValue = encryptData(JSON.stringify(value));
        localStorage?.setItem(key, encryptedValue);
        return true;
    } catch (error) {
        console.error(`Error setting encrypted item for key "${key}":`, error);
        return false;
    }
}

/**
 * 获取加密的 localStorage 项
 * @param key - 存储项的键
 * @param callback - 在解密失败时执行的回调函数
 * @returns 返回存储项的值或 null
 */
export const getEncryptedItem = (key: string, callback?: () => void): any | null => {
    try {
        const encryptedValue = localStorage?.getItem(key);
        if (encryptedValue) {
            const decryptedData = decryptData(encryptedValue);
            if (decryptedData === null && callback) {
                callback();
            }
            return decryptedData;
        }
        return null;
    } catch (error) {
        console.error(`Error getting encrypted item for key "${key}":`, error);
        if (callback) {
            callback?.();
        }
        return null;
    }
}