import { ISchema } from '@formily/react'

export const task_fb_tag_post: ISchema = {
  type: 'object',
  title: '到话题下发%s个动态',
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
    },
    condition_number: {
      type: 'number',
      title: '条件(个)',
      description: '发布x个',
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
      'x-reactions': [
        {
          dependencies: ['.type'],
          fulfill: {
            state: {
              value: '{{$deps[0] === 1 ? 1 : $self.value}}',
              display: '{{$deps[0] === 1 ? "hidden" : "visible"}}',
            },
          },
        },
      ],
    },
    tag_id: {
      type: 'string',
      title: '话题',
      description: '选择话题',
      'x-decorator': 'FormItem',
      'x-component': 'GuildDataSelect',
      'x-component-props': {
        type: 'tag',
        placeholder: '请选择话题',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请选择话题',
        },
      ],
    },
  },
  'x-reactions': {
    dependencies: ['.task_event'],
    fulfill: {
      state: {
        visible: '{{$deps[0] === "task_fb_tag_post"}}',
      },
    },
  },
}
