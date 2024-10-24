import { ISchema } from '@formily/react'

export const task_mall_order_product: ISchema = {
  type: 'object',
  title: '在商城购买某种特定商品',
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
      default: 1,
      'x-validator': [
        {
          required: true,
          message: '请选择任务周期类型',
        },
      ],
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
      'x-reactions': [
        {
          dependencies: ['.type'],
          fulfill: {
            state: {
              display: '{{$deps[0] === 1 ? "hidden" : "visible"}}',
              componentProps: {
                optionsTypes: '{{$deps[0] === 2 ? "TimeInterval" : "TaskCount"}}',
                placeholder: '{{$deps[0] === 2 ? "请选择任务刷新时间" : "请选择任务次数"}}',
              },
              title: '{{$deps[0] === 2 ? "任务刷新时间" : "任务次数"}}',
              value: '{{$deps[0] === 1 ? 1 : $self.value}}',
            },
          },
        },
      ],
    },
    condition_number: {
      type: 'number',
      title: '条件(次)',
      description: '购买多少次',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入任务次数',
      },
      'x-validator': [
        {
          required: true,
          message: '请输入任务次数',
        },
        {
          validator: (value: number) => value > 0,
          message: '任务次数必须大于0',
        },
        {
          format: 'number',
          message: '必须是数字',
        },
      ],
      default: 1,
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
        visible: '{{$deps[0] === "task_mall_order_product"}}',
      },
    },
  },
}
