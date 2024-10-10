import { message } from 'antd'
import dayjs from 'dayjs'


export function convertBytesToReadableSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  let formattedSize = size.toFixed(2)
  if (Number.isInteger(size)) {
    formattedSize = size.toFixed(0)
  }

  return `${formattedSize} ${units[unitIndex]}`
}

export enum SupportedImageFormats {
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
  PNG = 'image/png',
  WEBP = 'image/webp',
  GIF = 'image/gif',
}
export enum SupportedVideoFormats {
  MP4 = 'video/mp4',
}


export enum SupportedFileFormats {
  CSV = 'text/csv',
}

function getFormattedAllowedFormats(allowedFormats: string[]): string {
  return (Array.isArray(allowedFormats) ? allowedFormats : [allowedFormats])
    .map(format => format.split('/')[1].toUpperCase())
    .join('、')
    .toLocaleUpperCase()
}

export const imageFileCheck = (
  file: File,
  config?: {
    showTips?: boolean
    fileTypes?: string[]
    /**
     * 单位 KB
     */
    size?: number
  }
) => {
  const {
    showTips = true,
    fileTypes = [SupportedImageFormats.JPEG, SupportedImageFormats.JPG, SupportedImageFormats.PNG],
    size = 1024,
  } = config ?? {}

  const isSupportedType = fileTypes.includes(file.type as string)
  const isWithinSizeLimit = (file.size as number) / 1024 <= size

  if (!isSupportedType) {
    if (showTips) {
      message.error(`仅支持 ${getFormattedAllowedFormats(fileTypes)} 图片格式`)
    }
    return false
  }

  if (!isWithinSizeLimit) {
    if (showTips) {
      message.error(`图片体积最大不能超过 ${convertBytesToReadableSize(size * 1024)}`)
    }
    return false
  }

  return true
}

export const videoFileCheck = (
  file: File,
  config?: {
    showTips?: boolean
    fileTypes?: string[]
    /**
     * 单位 KB
     */
    size?: number
  }
) => {
  const { showTips = true, fileTypes = [SupportedVideoFormats.MP4], size = 1024 } = config ?? {}

  const isSupportedType = fileTypes.includes(file.type as string)
  console.log("%c Line:97 🥥 isSupportedType", "color:#3f7cff", isSupportedType);
  const isWithinSizeLimit = (file.size as number) / 1024 <= size

  if (!isSupportedType) {
    if (showTips) {
      message.error(`仅支持 ${getFormattedAllowedFormats(fileTypes)} 视频格式`)
    }
    return false
  }

  if (!isWithinSizeLimit) {
    if (showTips) {
      message.error(`视频体积最大不能超过 ${convertBytesToReadableSize(size * 1024)}`)
    }
    return false
  }

  return true
}

export const FileCheck = (
  file: File,
  config?: {
    showTips?: boolean
    fileTypes?: string[]
    /**
     * 单位 KB
     */
    size?: number
  }
) => {
  const { showTips = true, fileTypes = [SupportedFileFormats.CSV], size = 1024 } = config ?? {}
  const isSupportedType = fileTypes.includes(file.type as string)
  const isWithinSizeLimit = (file.size as number) / 1024 <= size

  if (!isSupportedType) {
    if (showTips) {
      console.log("%c Line:145 🍇 showTips", "color:#33a5ff", showTips);
      message.error(`仅支持 ${getFormattedAllowedFormats(fileTypes)} 文件格式`)
    }
    return false
  }

  if (!isWithinSizeLimit) {
    if (showTips) {
      message.error(`文件体积最大不能超过 ${convertBytesToReadableSize(size * 1024)}`)
    }
    return false
  }

  return true
}

export function getImageDimensions(url: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

export function getVideoDimensions(url: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'auto'
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    video.src = url
    video.currentTime = 0.5
    video.addEventListener('loadedmetadata', () => {
      let { videoWidth, videoHeight } = video
      // 偶现获取视频宽高为零
      if (videoWidth === 0 || videoHeight === 0) {
        video.style.cssText = 'position: fixed; bottom: 1000000px; right: 1000000px;'
        document.body.append(video)
        const clientRect = video.getBoundingClientRect()
        videoWidth = clientRect.width
        videoHeight = clientRect.height
      }
      if (videoWidth === 0 || videoHeight === 0) {
        video.parentNode && video.parentNode.removeChild(video)
        reject('get video size error')
        return
      }
      video.parentNode && video.parentNode.removeChild(video)
      resolve({ width: videoWidth, height: videoHeight })
    })
  })
}

export const getFileNameFromLink = (link: string, maxLength?: number) => {
  const linkArr = link.split('.')
  const fileType = linkArr.pop()
  let fileName = linkArr.pop()?.split('/').pop()
  if (fileName && maxLength && fileName.length > maxLength) {
    fileName = fileName.slice(0, maxLength)
  }
  return `${fileName}.${fileType}`
}

export const lookH5Detail = (id: string | number) => {
  const href = `${window.location.origin}/shop/pages/ShopDetail/index?id=${id}&shopId=${localStorage.getItem('CURR_SHOP_ID')}`
  window.open(href, '_blank')
}

// 复制到粘贴板
export const copy = (str: string) => {
  const input = document.createElement('textarea')
  input.value = str
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  message.success('复制成功')
}

export function uniqBy(array: [], key: string) {
  const seen = new Set()
  return array
    .map(item => item[key])
    .filter(value => {
      if (seen.has(value)) {
        return false
      }
      seen.add(value)
      return true
    })
}

export const timeToUnix = (time: string) => dayjs(time).unix()



export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
