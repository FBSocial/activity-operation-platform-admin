import { ISchema } from '@formily/react'

export const task_fb_activity_login: ISchema = {
  type: 'object',
  title: '累计登录活动x天',
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
      default: 1,
      'x-value': 1,
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
        placeholder: '请选择任务刷新时间',
        optionsTypes: 'TimeInterval',
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
      title: '条件(次)',
      description: '累计登录活动x天',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 1,
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
    },
  },
  'x-reactions': {
    dependencies: ['.task_event'],
    fulfill: {
      state: { visible: `{{$deps[0] === "task_fb_activity_login"}}` },
    },
  },
}
