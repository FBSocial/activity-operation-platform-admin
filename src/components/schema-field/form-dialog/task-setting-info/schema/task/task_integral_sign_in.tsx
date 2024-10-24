import { ISchema } from '@formily/react'

export const task_integral_sign_in: ISchema = {
  type: 'object',
  title: '邀请x位好友',
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
      'x-value': 1,
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
      'x-reactions': [
        {
          dependencies: ['.type'],
          fulfill: {
            state: {
              display: '{{$deps[0] === 1 ? "hidden" : "visible"}}',
              value: '{{$deps[0] === 1 ? 1 : $self.value}}',
              componentProps: {
                optionsTypes: '{{$deps[0] === 2 ? "TimeInterval" : "TaskCount"}}',
                placeholder: '{{$deps[0] === 2 ? "请选择任务刷新时间" : "请选择任务次数"}}',
              },
              title: '{{$deps[0] === 2 ? "任务刷新时间" : "任务次数"}}',
            },
          },
        },
      ],
      'x-display': 'hidden',
    },

    sign_in_type: {
      type: 'number',
      title: '签到类型',
      description: '选择签到类型: 日签选择频道/月签填URL',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        placeholder: '请选择签到类型',
      },
      default: 1,
      enum: [
        {
          label: '日签',
          value: 1,
        },
        {
          label: '月签',
          value: 2,
        },
      ],
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请选择频道',
        },
      ],
    },
    // 日签选择频道
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
      'x-reactions': {
        dependencies: ['.sign_in_type'],
        fulfill: {
          state: {
            visible: `{{$deps[0] === 1}}`,
          },
        },
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请选择频道',
        },
      ],
    },
    // 月签填写 url
    sign_url: {
      type: 'string',
      title: '月签链接',
      description: '月签页面访问链接',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '填月签URL',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '填月签URL',
          format: 'url',
        },
      ],
      'x-reactions': {
        dependencies: ['.sign_in_type'],
        fulfill: {
          state: {
            visible: `{{$deps[0] === 2}}`,
          },
        },
      },
    },
    condition_number: {
      type: 'number',
      title: '条件(次)',
      description: '累计签到x天',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入任务次数',
      },
      default: 1,
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
    },
  },
  'x-reactions': {
    dependencies: ['.task_event'],
    fulfill: {
      state: {
        visible: '{{$deps[0] === "task_integral_sign_in"}}',
      },
    },
  },
}
