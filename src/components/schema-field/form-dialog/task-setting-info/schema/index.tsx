import { ISchema } from '@formily/react'
import { task_fb_activity_login } from './task/task_fb_activity_login'
import { task_fb_activity_share } from './task/task_fb_activity_share'
import { task_fb_channel_chat } from './task/task_fb_channel_chat'
import { task_fb_channel_view } from './task/task_fb_channel_view'
import { task_fb_circle_comment } from './task/task_fb_circle_comment'
import { task_fb_circle_like } from './task/task_fb_circle_like'
import { task_fb_circle_share } from './task/task_fb_circle_share'
import { task_fb_circle_view } from './task/task_fb_circle_view'
import { task_fb_circlepost_view } from './task/task_fb_circlepost_view'
import { task_fb_invite_join } from './task/task_fb_invite_join'
import { task_fb_question_answer } from './task/task_fb_question_answer'
import { task_fb_tag_post } from './task/task_fb_tag_post'
import { task_integral_sign_in } from './task/task_integral_sign_in'
import { task_integral_task_done } from './task/task_integral_task_done'
import { task_mall_order_amount } from './task/task_mall_order_amount'
import { task_mall_order_number } from './task/task_mall_order_number'
import { task_mall_view_number } from './task/task_mall_view_number'

export const taskConfigSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
        labelCol: 7,
      },
      properties: {
        taskSettingType: {
          type: 'string',
          title: '任务类型',
          description: '选择任务类型',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {},
          'x-validator': [
            {
              required: true,
              whitespace: true,
            },
          ],
          'x-reactions': ['{{taskSettingTypeList}}'],
        },
        task_event: {
          type: 'string',
          title: '任务选择',
          description: '选择任务',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-reactions': ['{{getSecondTaskList}}'],
          'x-validator': [
            {
              required: true,
              whitespace: true,
            },
          ],
        },
        task_fb_activity_share,
        task_fb_invite_join,
        task_fb_activity_login,
        task_integral_sign_in,
        task_fb_circle_view,
        task_fb_circlepost_view,
        task_fb_channel_chat,
        task_fb_channel_view,
        task_fb_question_answer,
        task_mall_view_number,
        task_mall_order_number,
        task_fb_circle_comment,
        task_fb_circle_like,
        task_fb_circle_share,
        task_fb_tag_post,
        task_integral_task_done,
        task_mall_order_amount,
        reward_number: {
          type: 'string',
          title: '任务奖励次数',
          description: '例：拉新人可获得1次抽奖机会或2次抽奖机会',
          'x-decorator': 'FormItem',
          'x-component': 'TaskRewardCountSelect',
          default: '1',
          'x-validator': [
            {
              required: true,
              whitespace: true,
            },
            {
              pattern: /^\d+$/,
              message: '请输入正整数',
            },
          ],
        },
      },
    },
  },
}
