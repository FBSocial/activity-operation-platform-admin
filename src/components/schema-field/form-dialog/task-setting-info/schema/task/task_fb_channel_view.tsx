import { ISchema } from '@formily/react'

export const task_fb_channel_view: ISchema = {
  type: 'object',
  title: '浏览指定的频道(文字频道)',
  properties: {
    type: {
      type: 'number',
      title: '任务周期类型',
      description: '任务周期类型, 例：比如一次性的，每日型的',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
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
      description: '浏览x次',
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
          format: 'number',
        },
      ],
      default: 1,
      'x-value': 1,
      'x-display': 'hidden',
    },
    channel_id: {
      type: 'string',
      title: '频道',
      description: '选择频道',
      'x-decorator': 'FormItem',
      'x-component': 'GuildDataSelect',
      'x-component-props': {
        type: 'textChannels',
        placeholder: '请选择频道',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请选择频道',
        },
      ],
    },
  },
  'x-reactions': {
    dependencies: ['.task_event'],
    fulfill: {
      state: {
        visible: '{{$deps[0] === "task_fb_channel_view"}}',
      },
    },
  },
}
