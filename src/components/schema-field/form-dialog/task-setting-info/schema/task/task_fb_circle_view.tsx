import { ISchema } from '@formily/react'

export const task_fb_circle_view: ISchema = {
  type: 'object',
  title: '每日浏览圈子',
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
          whitespace: true,
          message: '请选择任务周期类型',
        },
      ],
      'x-display': 'hidden',
    },
    task_refresh_time: {
      type: 'number',
      title: '任务刷新时间(次)',
      description: '非一次性任务必填，例：每天或每2天可浏览一次圈子',
      'x-decorator': 'FormItem',
      'x-component': 'TaskFrequencySelect',
      default: 1,
      'x-component-props': {
        placeholder: '请选择任务刷新时间',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
        },
      ],
      'x-value': 1,
      'x-display': 'hidden',
    },
    condition_number: {
      type: 'number',
      title: '条件(次)',
      description: '具体任务的次数',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入任务次数',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          format: 'number',
          message: '请输入正确的条件(次)',
        },
      ],
      default: 1,
      'x-value': 1,
      'x-display': 'hidden',
    },
  },
  'x-reactions': {
    dependencies: ['.task_event'],
    fulfill: {
      state: { visible: `{{$deps[0] === "task_fb_circle_view"}}` },
    },
  },
}
