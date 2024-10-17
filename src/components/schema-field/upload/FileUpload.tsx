import { uploadCdkey, uploadPic } from '@/api/admin'
import {
  FileCheck,
  getFileNameFromLink,
  imageFileCheck,
  SupportedFileFormats,
  SupportedImageFormats,
  SupportedVideoFormats,
  videoFileCheck,
} from '@/utils/common-func'
import { promiseWithResolvers } from '@/utils/promiseWithResolvers'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { isArrayField, type Field } from '@formily/core'
import { useField } from '@formily/react'
import { toArr } from '@formily/shared'
import { message as antdMessage, GetProp, Image, Popconfirm, UploadFile } from 'antd'
import { isEqual } from 'es-toolkit'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IUploadProps, Upload } from './Upload'

// 定义文件检查函数类型
type FileCheckFunction = (file: File, options: { fileTypes?: string[]; size: number }) => boolean

// 定义文件检查函数映射
const fileCheckFunctions: Record<string, FileCheckFunction> = {
  image: imageFileCheck,
  video: videoFileCheck,
  file: FileCheck,
}

function convertUrlValue(values?: string | string[]): UploadFile[] {
  if (!values) return []
  const _values = Array.isArray(values) ? values : [values]
  return _values.map((_value, index) => {
    return typeof _value === 'string' ?
        { url: _value, thumbUrl: _value, name: getFileNameFromLink(_value, 20), status: 'done', uid: `${_value}-${index}` }
      : _value
  })
}

const FileUpload: React.FC<
  Omit<IUploadProps, 'onChange'> & {
    value?: string | string[]
    onChange?: (value?: string | string[]) => void
    fileTypes?: SupportedImageFormats[] | SupportedVideoFormats[] | SupportedFileFormats[]
    uploadType?: 'image' | 'video' | 'file'
    /**
     * 单位 KB
     */
    fileSize?: number
    message?: string
    accept?: string
  }
> = ({
  value,
  maxCount = 1,
  onChange,
  onPreview,
  fileTypes = [SupportedImageFormats.JPEG, SupportedImageFormats.JPG, SupportedImageFormats.PNG, SupportedImageFormats.GIF],
  fileSize = 10 * 1024,
  uploadType = 'image',
  message,
  accept,
  ...props
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>(convertUrlValue(value))
  const innerValue = useRef(value)
  const field = useField<Field>()
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const removePromiseWithResolvers = useRef<ReturnType<typeof promiseWithResolvers<boolean>>>()

  const uploadFileCustom: GetProp<typeof Upload, 'customRequest'> = options => {
    const { onSuccess, onError, onProgress, file } = options

    if (uploadType === 'file' || accept === '.csv') {
      uploadCdkey(file as File, onProgress)
        .then(res => {
          if (res?.code === 0 && res?.data?.url) {
            const url = res?.data?.url
            onSuccess?.({ success: true, url, thumbUrl: url })
            antdMessage.success(`上传成功`)
          } else {
            onError?.(new Error(res.msg || '上传失败'))
            antdMessage.error(`上传失败`)
          }
        })
        .catch((err: any) => {
          onError?.(err)
        })
    } else {
      uploadPic(file as File, onProgress)
        .then(res => {
          if (res?.code === 0 && res?.data?.url) {
            const url = res?.data?.url
            onSuccess?.({ success: true, url, thumbUrl: url })
            antdMessage.success(`上传成功`)
          } else {
            onError?.(new Error(res.msg || '上传失败'))
            antdMessage.error(`上传失败`)
          }
        })
        .catch((err: any) => {
          onError?.(err)
        })
    }
  }

  const handleChange = (fileList: UploadFile[]) => {
    setFileList(fileList)
    const urls: string[] = fileList.filter(item => item.status === 'done').map(item => item.url || item.response?.data?.downloadUrl)
    innerValue.current = isArrayField(field) ? urls : urls[0] || ''
    onChange?.(innerValue.current)
  }

  const handlePreview = async (file: UploadFile) => {
    let src = file.url
    let thumbUrl: string | undefined = undefined
    if (!src) {
      thumbUrl = URL.createObjectURL(file.originFileObj as Blob)
      src = thumbUrl
    }
    if (src || file.type?.startsWith('image/')) {
      // 预览图片
      setPreviewImage(src)
      setPreviewVisible(true)
    }

    if (thumbUrl) URL.revokeObjectURL(thumbUrl)
  }

  const renderDescription = useMemo(() => {
    if (!message) return null
    return (
      <pre className="text-xs text-gray-500">
        {message?.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </pre>
    )
  }, [message])

  const generateAccept = (): string => {
    if (accept) return accept

    // 确保 uploadType 和 fileTypes 是有效的
    if (!uploadType || !Array.isArray(fileTypes) || fileTypes.length === 0) {
      return ''
    }

    // 提取重复的代码到一个单独的函数
    const getFileExtensions = (types: string[]): string => {
      return types
        .map(type => {
          if (type.includes('/')) {
            return '.' + type.split('/')[1]
          } else {
            return '.' + type
          }
        })
        .join(',')
    }

    switch (uploadType) {
      case 'image':
      case 'video':
      case 'file':
        return getFileExtensions(fileTypes)
      default:
        return ''
    }
  }

  useEffect(() => {
    if (!isEqual(toArr(innerValue.current), toArr(value))) {
      innerValue.current = value
      setFileList(convertUrlValue(value))
    }
  }, [value])

  useEffect(() => {
    return () => {
      if (removePromiseWithResolvers.current) removePromiseWithResolvers.current.resolve(false)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Upload
        {...props}
        fileList={fileList}
        maxCount={maxCount}
        onChange={handleChange}
        onPreview={onPreview ?? handlePreview}
        beforeUpload={file => {
          const checkFunction = fileCheckFunctions[uploadType]
          if (checkFunction) {
            return checkFunction(file, { fileTypes, size: fileSize })
          }
          return false // 返回 false 表示文件不会被上传
        }}
        showUploadList={{
          showPreviewIcon: file => file.status !== 'error' && uploadType !== 'file',
          showRemoveIcon: true,
          removeIcon: () => {
            return (
              <Popconfirm
                title="确定删除吗?"
                onConfirm={() => {
                  removePromiseWithResolvers.current?.resolve(true)
                }}
                onCancel={() => {
                  removePromiseWithResolvers.current?.reject()
                }}
              >
                <DeleteOutlined />
              </Popconfirm>
            )
          },
        }}
        onRemove={async () => {
          removePromiseWithResolvers.current = promiseWithResolvers()
          return await removePromiseWithResolvers.current.promise
        }}
        customRequest={uploadFileCustom}
        listType="picture-card"
        accept={generateAccept()}
      >
        {fileList?.length >= maxCount ? null : (
          <>
            <UploadOutlined size={20} className="mr-2" /> 点击上传
          </>
        )}
      </Upload>
      {renderDescription}

      <Image
        style={{ display: 'none' }}
        src={previewImage}
        preview={{
          visible: previewVisible,
          onVisibleChange: visible => {
            setPreviewVisible(visible)
          },
        }}
      />
    </div>
  )
}

export default FileUpload
