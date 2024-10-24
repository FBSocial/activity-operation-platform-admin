import type { ISchema } from '@formily/react'

export const moreActivityList: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '活动标题',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入活动标题',
        maxLength: 20,
        showCount: true,
      },
      'x-validator': [{ required: true, message: '请输入分享文案' }],
    },
    banner: {
      type: 'string',
      title: 'Banner图',
      'x-decorator': 'FormItem',
      'x-component': 'FileUpload',
      'x-component-props': {
        message: '图片尺寸\n建议上传 1920px * 960px 的图片',
      },
      'x-validator': [{ required: true, message: '请上传图片' }],
    },
    url: {
      type: 'string',
      title: '打开 URL',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入 URL',
      },
      'x-validator': [{ required: true, message: '请输入 URL', format: 'url' }],
    },
  },
}
