import type { ISchema } from '@formily/react'

export const shareConfigSchema: ISchema = {
  type: 'object',
  properties: {
    internalShare: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '站内分享',
        size: 'small',
      },
      properties: {
        appDesc: {
          type: 'string',
          title: '分享文案',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            autoSize: { minRows: 3, maxRows: 6 },
            placeholder: '请输入分享文案',
            maxLength: 100,
            showCount: true,
          },
          'x-validator': [{ required: true, message: '请输入分享文案' }],
        },
        appImage: {
          type: 'string',
          title: '分享Banner图',
          'x-decorator': 'FormItem',
          'x-component': 'FileUpload',
          'x-component-props': {
            message: '图片尺寸\n建议上传 1920px * 960px 的图片',
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              message: '请上传分享Banner图',
            },
          ],
        },
      },
    },
    externalShare: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '站外分享',
        type: 'inner',
        size: 'small',
      },
      properties: {
        shareTitle: {
          type: 'string',
          title: '分享标题',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入分享标题',
          },
          'x-validator': [{ required: true, message: '请输入分享标题' }],
        },
        shareSubTitle: {
          type: 'string',
          title: '分享正文',
          'x-decorator': 'FormItem',
          'x-component': 'Input.TextArea',
          'x-component-props': {
            autoSize: { minRows: 3, maxRows: 6 },
            placeholder: '请输入分享正文',
            maxLength: 40,
            showCount: true,
          },
          'x-validator': [{ required: true, message: '请输入分享正文' }],
        },
        shareIcon: {
          type: 'string',
          title: '分享小图',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            asterisk: true,
          },
          'x-component': 'FileUpload',
          'x-component-props': {
            message: '图片尺寸\n建议上传 100px * 100px 的图片',
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              message: '请上传分享小图',
            },
          ],
        },
      },
    },
  },
}
