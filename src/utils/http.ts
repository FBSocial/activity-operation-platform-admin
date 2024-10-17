import { message } from 'antd'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, type AxiosError } from 'axios'
import { removeUserInfo } from './storage'

export interface BackEndResponseType<T> {
  code: number
  msg: string
  data: T
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  toast?: boolean
}

const instance: AxiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: import.meta.env.VITE_API_HOST,
})

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

// 响应拦截
instance.interceptors.response.use(
  <T>(response: AxiosResponse<BackEndResponseType<T>>): T | Promise<AxiosResponse<BackEndResponseType<T>>> => {
    const { data, headers, config } = response
    const { toast = true } = config as CustomAxiosRequestConfig
    if (data.code !== 0 && !headers['content-type']?.includes('application/vnd.ms-excel')) {
      // 失败消息提示, data.code === 6 时，忽略提示信息
      if (data.code !== 6 && toast) {
        message?.error(data.msg)
      }
      if (data.code === 3001) {
        removeUserInfo() // 清除用户信息
        if (window.location.pathname !== '/login') {
          window.location.href = '/login' // 跳转到登录页面
        }
      }
      return Promise.reject<AxiosResponse<BackEndResponseType<T>>>({
        data: data as BackEndResponseType<unknown>,
        status: 500,
        statusText: '内部服务器错误',
        headers: {},
        config: {} as AxiosRequestConfig
      })
    }
    // 返回 data 字段，直接返回 T 类型
    return data as T; // 确保返回 AxiosResponse
  },
  (err: AxiosError<BackEndResponseType<unknown>>) => {
    const axiosError = err as { response?: AxiosResponse }
    const msg = axiosError?.response?.data?.msg || '请求失败'
    const { toast = true } = ((axiosError?.response as AxiosResponse)?.config as CustomAxiosRequestConfig) ?? {}

    console.log("%c Line:57 🍐 axiosError?.response", "color:#4fff4B", axiosError?.response);


    if (axiosError?.response?.status === 409) {
      message?.destroy()
      message?.warning({
        content: msg,
        duration: 3,
        onClose: () => {
          window.location.reload()
        },
      })
    }

    if (axiosError?.response?.status === 401) {
      message?.warning({
        content: msg,
        duration: 1.5,
        onClose: () => {

        },
      })
    }

    switch (axiosError?.response?.status) {
      case 409:
        message?.warning({
          content: msg,
          duration: 1.5,
          onClose: () => {
          },
        })
        break
      case 401:
        message?.destroy()
        message?.warning({
          content: msg,
          duration: 1.5,
          onClose: () => {
          },
        })
        break
      case 403:
        message?.destroy()
        message?.error('无权限操作')
        throw err
      default:
        if (toast) {
          message?.error(msg)
        }
        break
    }

    return Promise.reject({
      code: -1,
      msg,
      data: null,
    } as BackEndResponseType<null>)
  }
)

/**
 * HTTP 请求函数，返回完整的 BackEndResponseType
 * @param {CustomAxiosRequestConfig} config - Axios 请求配置
 * @returns {Promise<BackEndResponseType<T>>} 后端返回的完整响应数据
 * @template T - 响应数据的类型
 * @template D - 请求数据的类型
 */
const httpWithFullResponse = async <T, D = unknown>(config: CustomAxiosRequestConfig): Promise<BackEndResponseType<T>> => {
  const response = await instance.request<unknown, BackEndResponseType<T>, D>(config);
  return response;
};

/**
 * HTTP 请求函数，只返回 data 字段
 * @param {CustomAxiosRequestConfig} config - Axios 请求配置
 * @returns {Promise<T>} 后端返回的 data 字段数据
 * @template T - 响应数据的类型
 * @template D - 请求数据的类型
 */
const http = async <T, D = unknown>(config: CustomAxiosRequestConfig): Promise<T> => {
  const response = await httpWithFullResponse<T, D>(config);
  return response.data;
};

export { http, httpWithFullResponse }
export default http;