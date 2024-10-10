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
        placeholder: '#FFF(十六进制的色值或者 rgba(255,255,255,1)',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
        },
        {
          validator: value => {
            const hexPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/
            const rgbaPattern = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),([01]|0?\.\d+)\)$/
            if (!hexPattern.test(value) && !rgbaPattern.test(value)) {
              return '请输入有效的十六进制色值或 rgba 值'
            }
            return true
          },
        },
      ],
    },
  },
}

export default schema
