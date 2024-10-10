import { UploadOutlined } from '@ant-design/icons'
import { Field } from '@formily/core'
import { connect, useField } from '@formily/react'
import { reaction } from '@formily/reactive'
import { toArr } from '@formily/shared'
import { Upload as AntdUpload, Button } from 'antd'
import { UploadProps as AntdUploadProps, UploadChangeParam } from 'antd/lib/upload'
import { UploadFile } from 'antd/lib/upload/interface'
import React, { useEffect } from 'react'

export type IUploadProps = Omit<AntdUploadProps, 'onChange'> & {
  value?: any
  textContent?: React.ReactNode
  onChange?: (fileList: UploadFile[]) => void
  serviceErrorMessage?: string
}

type ComposedUpload = React.FC<React.PropsWithChildren<IUploadProps>>

type IExtendsUploadProps = {
  fileList?: UploadFile[]
  serviceErrorMessage?: string
  onChange?: (...args: any) => void
}

const getURL = (target: any) => {
  return target?.['url'] || target?.['downloadURL'] || target?.['imgURL']
}
const getThumbURL = (target: any) => {
  return target?.['thumbUrl'] || target?.['url'] || target?.['downloadURL'] || target?.['imgURL']
}

const getErrorMessage = (target: any) => {
  return target?.errorMessage || target?.errMsg || target?.errorMsg || target?.message || (typeof target?.error === 'string' ? target.error : '')
}

const getState = (target: any) => {
  if (target?.success === false) return 'error'
  if (target?.failed === true) return 'error'
  if (target?.error) return 'error'
  return target?.state || target?.status
}

const normalizeFileList = (fileList?: UploadFile[]) => {
  if (fileList && fileList.length) {
    return fileList.map((file, index) => {
      return {
        ...file,
        uid: file.uid || `${index}`,
        status: getState(file.response) || getState(file),
        url: getURL(file) || getURL(file?.response),
        thumbUrl: getThumbURL(file) || getThumbURL(file?.response),
      }
    })
  }
  return []
}

const useValidator = (validator: (value: any) => string) => {
  const field = useField<Field>()
  useEffect(() => {
    const dispose = reaction(
      () => field.data,
      data => {
        const value = data?.fieldList ?? []
        const message = validator(value)
        field.setFeedback?.({
          // triggerType: 'onInput',
          type: 'error',
          code: 'ValidateError',
          messages: message ? [message] : [],
        })
      }
    )
    return () => {
      dispose()
    }
  }, [])
}

const useUploadValidator = (serviceErrorMessage = '上传失败，请重新上传') => {
  useValidator(value => {
    const list = toArr(value)
    for (let i = 0; i < list.length; i++) {
      if (list[i]?.status === 'error') {
        return getErrorMessage(list[i]?.response) || getErrorMessage(list[i]) || serviceErrorMessage
      }
    }
  })
}

function useUploadProps<T extends IExtendsUploadProps = IUploadProps>({ serviceErrorMessage, ...props }: T) {
  const field = useField<Field>()
  useUploadValidator(serviceErrorMessage)
  const onChange = (param: UploadChangeParam<UploadFile>) => {
    const _fileList = normalizeFileList([...param.fileList])
    field.setData({ ...field.data, fieldList: _fileList })
    props.onChange?.(_fileList)
  }
  return {
    ...props,
    fileList: normalizeFileList(props.fileList),
    onChange,
  }
}

const getPlaceholder = (props: IUploadProps) => {
  if (props.listType !== 'picture-card') {
    return (
      <Button>
        <UploadOutlined />
        {props.textContent}
      </Button>
    )
  }
  return null
}

export const Upload: ComposedUpload = connect((props: React.PropsWithChildren<IUploadProps>) => {
  return <AntdUpload {...useUploadProps(props)}>{props.children || getPlaceholder(props)}</AntdUpload>
})

export default Upload
