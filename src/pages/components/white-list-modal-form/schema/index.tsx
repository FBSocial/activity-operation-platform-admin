import type { ISchema } from '@formily/react'

const schema: ISchema = {
  type: 'void',
  'x-component': 'FormLayout',
  'x-component-props': {
    layout: 'horizontal',
  },
  properties: {
    members: {
      type: 'string',
      title: '白名单',
      description: '白名单用户可查看h5预览链接，上限50个',
      'x-decorator': 'FormItem',
      'x-decorator-props': {},
      'x-component': 'Input.TextArea',
      'x-component-props': {
        autoSize: { minRows: 3, maxRows: 6 },
        placeholder: '请输入用户ID，可批量添加，以英文逗号分隔',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请输入白名单用户ID',
        },
        {
          pattern: /^[0-9,]+$/,
          message: '只能输入数字和英文逗号',
        },
      ],
    },
  },
}

export default schema
