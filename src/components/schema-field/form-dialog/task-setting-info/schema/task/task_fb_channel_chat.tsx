import { ISchema } from '@formily/react'

export const task_fb_channel_chat: ISchema = {
  type: 'object',
  title: '到指定的频道下发言',
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
      description: '发言x次',
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
      ],
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
        visible: '{{$deps[0] === "task_fb_channel_chat"}}',
      },
    },
  },
}
