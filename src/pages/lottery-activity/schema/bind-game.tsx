import type { ISchema } from '@formily/react'

const schema: ISchema = {
  type: 'object',
  properties: {
    game_binding_status: {
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      title: '开关',
      description: '启用该功能可以配置绑定账号信息',
      'x-reactions': {
        fulfill: {
          state: {
            value: '{{ $self.value ? 1 : 0 }}',
          },
        },
      },
    },
    selectGame: {
      type: 'string',
      title: '选择游戏',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: '微信', value: 1 },
        { label: '支付宝', value: 2 },
        { label: '抖音', value: 3 },
        { label: '快手', value: 4 },
      ],
      'x-component-props': {
        placeholder: '请选择游戏',
      },
      'x-validator': [
        {
          message: '请选择游戏',
          required: true,
        },
      ],
      'x-reactions': {
        dependencies: ['.turnOnBindAccount'],
        fulfill: {
          state: {
            visible: '{{!!$deps[0]}}',
          },
        },
      },
    },
    game_binding_url: {
      type: 'string',
      title: '绑定页面 URL',
      description: '绑定流程介绍和操作页面',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入游戏链接',
        allowClear: true,
      },
      'x-validator': [
        {
          message: '请输入游戏链接',
          format: 'url',
          required: true,
        },
      ],
      'x-reactions': {
        dependencies: ['.selectGame'],
        fulfill: {
          state: {
            visible: '{{!!$deps[0]}}',
          },
        },
      },
    },
  },
}

export default schema
