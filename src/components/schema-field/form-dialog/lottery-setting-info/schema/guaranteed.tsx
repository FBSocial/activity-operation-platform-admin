import type { ISchema } from '@formily/react'

export const lotteryGuaranteedSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '奖品名称',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelcol: 8,
        wrapperCol: 16,
      },
      'x-component': 'Input',
      'x-component-props': {
        maxLength: 8,
        showCount: true,
        allowClear: true,
        labelcol: { span: 6 },
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请输入奖品名称',
        },
      ],
    },
    type: {
      type: 'number',
      title: '礼包类型',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelcol: 8,
        wrapperCol: 16,
      },
      'x-component': 'Select',
      'x-component-props': {},
      'x-hidden': true,
      default: 0,
      enum: [
        { label: '谢谢参与', value: 0 },
        { label: '常规礼包', value: 1 },
      ],
      'x-validator': [
        {
          required: true,
          message: '请选择礼包类型',
        },
      ],
    },
    img: {
      type: 'string',
      title: '奖品图',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelcol: 8,
        wrapperCol: 16,
      },
      'x-component': 'FileUpload',
      'x-component-props': {
        message: '图片尺寸\n建议上传 360px * 360px 的图片',
        fileSize: 3 * 1024,
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请上传奖品小图',
        },
      ],
    },
    probability: {
      type: 'number',
      title: '奖品概率(%)',
      description: '概率0-100%,概率越大被抽中几率越大，需考虑库存',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelcol: 8,
        wrapperCol: 16,
      },
      'x-component': 'InputNumber',
      'x-component-props': {
        max: 100,
        min: 0,
      },
      default: 0,
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请输入奖品概率(%)',
        },
        {
          format: 'number',
          message: '必须为数字',
        },
      ],
    },
    is_auto_grant: {
      type: 'string',
      title: '奖品下发',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        labelcol: 8,
        wrapperCol: 16,
      },
      'x-component-props': {},
      'x-hidden': true,
      default: 0,
      enum: [{ label: '兑换码下发', value: 0 }],
      'x-validator': [
        {
          required: true,
          message: '请选择奖品下发方式',
        },
      ],
      'x-reactions': {
        dependencies: ['type'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === 1}}',
          },
        },
      },
    },
    position: {
      type: 'number',
      title: '位置',
      'x-hidden': true,
      default: 0,
      'x-component': 'InputNumber',
      'x-component-props': {
        min: 0,
      },
    },
  },
}
