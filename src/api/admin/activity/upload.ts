import { httpWithFullResponse } from '@/utils/http';



export interface ActivityUploadPicData {
    url: string;
    file_path: string;
    file_name: string;
    file_ext: string;
    file_size: number;
    file_row: number;
}
/**
 * 上传图片接口
 *
 * 该接口用于上传图片文件。
 *
 * @param {File} file - 要上传的图片文件
 * @returns {Promise<any>} 返回上传图片的响应数据
 */
export function uploadPic(file: File, onUploadProgress?: (progressEvent: Partial<ProgressEvent> & { percent: number }) => void): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)

    return httpWithFullResponse<ActivityUploadPicData>({
        url: '/admin/file/upload',
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData,
        onUploadProgress: progressEvent => {
            const { loaded, total = 1 } = progressEvent
            const percentCompleted = Math.round((loaded * 100) / total)
            console.log(`上传进度: ${percentCompleted}%`)
            onUploadProgress?.({
                percent: percentCompleted,
                loaded,
                total,
            })
        },
        timeout: 1000 * 60 * 10,
    })
}



export interface CdkeyUploadData {
    url: string;
    file_path: string;
    file_name: string;
    file_ext: string;
    file_size: number;
    file_row: number;
}

/**
 * 上传兑换码接口
 *
 * 该接口用于上传兑换码文件，并将其与指定的活动关联。
 *
 * @param {string} activity_id - 活动ID
 * @param {File} file - 要上传的兑换码文件
 * @param {Function} onUploadProgress - 上传进度回调函数
 * @returns {Promise<any>} 返回上传兑换码的响应数据
 */
export function uploadCdkey(file: File, onUploadProgress?: (progressEvent: Partial<ProgressEvent> & { percent: number }) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    return httpWithFullResponse<CdkeyUploadData>({
        url: `/admin/cdkey/upload`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData,
        onUploadProgress: progressEvent => {
            const { loaded, total = 1 } = progressEvent;
            const percentCompleted = Math.round((loaded * 100) / total);
            console.log(`上传进度: ${percentCompleted}%`);
            onUploadProgress?.({
                percent: percentCompleted,
                loaded,
                total,
            });
        },
        timeout: 1000 * 60 * 10,
    });
}