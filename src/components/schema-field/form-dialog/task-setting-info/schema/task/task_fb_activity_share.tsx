import { ISchema } from '@formily/react'

export const task_fb_activity_share: ISchema = {
  type: 'object',
  title: '每日分享活动',
  properties: {
    type: {
      type: 'number',
      title: '任务周期类型',
      // 任务类型 1:一次性任务 2:每天 3:每周，4:每月
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
      description: '非一次性任务必填，例：每天或每2天可分享一次活动',
      'x-decorator': 'FormItem',
      'x-component': 'TaskFrequencySelect',
      default: 1,
      'x-value': 1,
      'x-component-props': {
        defaultValue: 1,
        placeholder: '请选择任务刷新时间',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
        },
      ],
      'x-display': 'hidden',
    },
    condition_number: {
      type: 'number',
      title: '条件(次、金额)',
      description: '具体任务的次数，比如评论多少次，点赞多少次，付费金额等',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 1,
      'x-value': 1,
      'x-component-props': {
        placeholder: '请输入任务次数',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          format: 'number',
          message: '请输入正确的条件(次、金额)',
        },
      ],
      'x-display': 'hidden',
    },
  },
  'x-reactions': {
    dependencies: ['.task_event'],
    fulfill: {
      state: { visible: `{{$deps[0] === "task_fb_activity_share"}}` },
    },
  },
}
