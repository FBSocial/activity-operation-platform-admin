import type { ISchema } from '@formily/react'

const schema: ISchema = {
  type: 'object',
  properties: {
    header_img: {
      type: 'string',
      title: '活动主图',
      description: '活动上半部分的主视觉图，需展示活动主题等关键信息',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        // asterisk: true,
      },
      'x-component': 'FileUpload',
      'x-component-props': {
        message: '图片尺寸\n建议上传 1125px * 1870px 的图片',
        fileSize: 3 * 1024,
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请上传图片',
        },
      ],
    },
    bg_img_color: {
      type: 'string',
      title: '活动背景色',
      description: '活动下半部分的背景色',
      'x-decorator': 'FormItem',
      'x-decorator-props': {},
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '#FFF（支持3位或6位十六进制色值）',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
        },
        {
          validator: value => {
            const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/
            if (!hexPattern.test(value)) {
              return '请输入有效的十六进制色值（3位或6位）'
            }
            return true
          },
        },
      ],
    },
  },
}

export default schema
