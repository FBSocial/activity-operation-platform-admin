import { ISchema } from '@formily/react'

export const task_mall_view_number: ISchema = {
  type: 'object',
  title: '在商城完成1次购买',
  properties: {
    type: {
      type: 'number',
      title: '任务周期类型',
      description: '任务周期类型, 例：比如一次性的，每日型的',
      'x-decorator': 'FormItem',
      'x-component': 'TaskTypeSelect',
      'x-component-props': {
        placeholder: '请选择任务周期类型',
      },
      default: 2,
      'x-value': 2,
      'x-validator': [
        {
          required: true,
          message: '请选择任务周期类型',
        },
      ],
      'x-display': 'hidden',
    },
    task_refresh_time: {
      type: 'number',
      title: '任务频率',
      'x-decorator': 'FormItem',
      'x-component': 'TaskFrequencySelect',
      'x-component-props': {
        placeholder: '请选择任务频率',
      },
      'x-validator': [
        {
          required: true,
          message: '请选择',
        },
      ],
      default: 1,
      'x-value': 1,
      'x-display': 'hidden',
    },
    condition_number: {
      type: 'number',
      title: '条件(次)',
      description: '在商城浏览x次',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入条件(次)',
      },
      'x-validator': [
        {
          required: true,
          message: '请输入条件(次)',
        },
        {
          validator: (value: number) => value > 0,
          message: '条件(次)必须大于0',
        },
        {
          format: 'number',
          message: '必须是数字',
        },
      ],
      default: 1,
      'x-value': 1,
      'x-display': 'hidden',
    },
    mall_url: {
      type: 'string',
      title: '商城URL',
      description: '商城的访问链接',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入商城URL',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请输入商城URL',
          format: 'url',
        },
      ],
    },
  },
  'x-reactions': {
    dependencies: ['.task_event'],
    fulfill: {
      state: {
        visible: '{{$deps[0] === "task_mall_view_number"}}',
      },
    },
  },
}
