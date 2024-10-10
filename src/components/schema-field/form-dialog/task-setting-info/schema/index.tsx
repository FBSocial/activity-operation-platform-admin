import { AllTasks, DailyMonthlySignTasks, TaskRewardCount, TimeInterval } from '@/constant/schema/lottery-activity/task'
import { TaskTimeType } from '@/constant/schema/lottery-activity/task/time'
import { filterAndMapEnum } from '@/utils/array-utils'
import { ISchema } from '@formily/react'

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
        task: {
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
        // 促活留存-累计签到-显示签到类型
        [AllTasks.CumulativeCheckInDays.key]: {
          type: 'number',
          title: '签到类型',
          description: AllTasks.CumulativeCheckInDays.desc,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择类型',
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              message: '请选择类型',
            },
          ],
          default: DailyMonthlySignTasks.DailySign.value,
          enum: filterAndMapEnum(DailyMonthlySignTasks),
          'x-reactions': {
            dependencies: ['.task'],
            fulfill: {
              state: {
                visible: `{{$deps[0] === '${AllTasks.CumulativeCheckInDays.task_event}'}}`,
              },
            },
          },
        },
        channel_id: {
          type: 'string',
          title: '频道',
          description: '选择频道',
          'x-decorator': 'FormItem',
          'x-component': 'GuildDataSelect',
          'x-component-props': {
            type: 'channel',
            placeholder: '请选择频道',
          },
          'x-reactions': {
            dependencies: ['.task', `.${AllTasks.CumulativeCheckInDays.key}`],
            fulfill: {
              state: {
                visible: `{{
                  ( $deps[0] === '${AllTasks.CumulativeCheckInDays.task_event}' && $deps[1] === ${DailyMonthlySignTasks.DailySign.value} ) ||
                  $deps[0] === '${AllTasks.PostXDynamicInTopic.task_event}' ||
                  $deps[0] === '${AllTasks.SpeakInChannel.task_event}' ||
                  $deps[0] === '${AllTasks.CompleteXAnswers.task_event}'
                }}`,
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
        [DailyMonthlySignTasks.MonthlySign.key]: {
          type: 'string',
          title: '任务配置',
          description: DailyMonthlySignTasks.MonthlySign.desc,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '填bot URL',
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              message: '填bot URL',
              format: 'url',
            },
          ],
          'x-reactions': {
            dependencies: ['.task', `.${AllTasks.CumulativeCheckInDays.key}`],
            fulfill: {
              state: {
                visible: `{{
                  $deps[0] === '${AllTasks.CumulativeCheckInDays.task_event}' && $deps[1] === ${DailyMonthlySignTasks.MonthlySign.value}
                }}`,
              },
            },
          },
        },
        tag_id: {
          type: 'string',
          title: '标签',
          description: '选择标签',
          'x-decorator': 'FormItem',
          'x-component': 'GuildDataSelect',
          'x-component-props': {
            type: 'tag',
            placeholder: '请选择标签',
          },
          'x-reactions': {
            dependencies: ['.task'],
            fulfill: {
              state: {
                visible: `{{
                  $deps[0] === '${AllTasks.BrowseDesignatedChannel.task_event}' ||
                  $deps[0] === '${AllTasks.LikeCircleXTimes.task_event}' ||
                  $deps[0] === '${AllTasks.CompleteXComments.task_event}'
                }}`,
              },
            },
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              message: '请选择标签',
            },
          ],
        },
        mallUrl: {
          type: 'string',
          title: '商城URL',
          description: AllTasks.DailyBrowseMall.desc,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '填商城URL',
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              message: '填商城URL',
              format: 'url',
            },
          ],
          'x-reactions': {
            dependencies: ['.task', `.${AllTasks.DailyBrowseMall.key}`],
            fulfill: {
              state: {
                visible: `{{
                  $deps[0] === '${AllTasks.DailyBrowseMall.task_event}'
                }}`,
              },
            },
          },
        },
        type: {
          type: 'number',
          title: '任务周期类型',
          // 任务类型 1:一次性任务 2:每天 3:每周，4:每月
          description: '任务周期类型, 例：比如一次性的，每日型的',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {},
          default: TaskTimeType.OneTime.value,
          enum: filterAndMapEnum(TaskTimeType),
          'x-validator': [
            {
              required: true,
              whitespace: true,
            },
          ],
        },
        task_refresh_time: {
          type: 'number',
          title: '任务刷新时间(次)',
          description: '非一次性任务必填，例：每天或每2天可分享一次活动',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          default: 1,
          enum: filterAndMapEnum(TimeInterval),
          'x-component-props': {},
          'x-validator': [
            {
              required: false,
              whitespace: true,
            },
          ],
          'x-reactions': {
            dependencies: ['.task,.type'],
            fulfill: {
              state: {
                hidden: `
                {{$deps[0] === "task_fb_actvity_share" || $deps[1] === 1}}
                `,
                value: '{{$deps[0] === 1 ? 1 : $self.value}}',
              },
            },
          },
        },
        condition_number: {
          type: 'number',
          title: '条件(次、金额)',
          description: '具体任务的次数，比如评论多少次，点赞多少次，付费金额等',
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          default: 1,
          'x-component-props': {
            min: 1,
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              format: 'number',
            },
          ],
          'x-reactions': {
            dependencies: ['.task'],
            fulfill: {
              state: {
                hidden: `
                {{$deps[0] === "task_fb_actvity_share"}}

                `,
                value: '{{$deps[0] === "task_fb_actvity_share" ? 1 : $self.value}}',
              },
            },
          },
        },
        reward_number: {
          type: 'string',
          title: '任务奖励次数',
          description: '例：拉新人可获得1次抽奖机会或2次抽奖机会',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          default: '1',
          enum: filterAndMapEnum(TaskRewardCount),
          'x-component-props': {
            maxLength: 3,
          },
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
        position: {
          type: 'number',
          title: '排序位置',
          description: '数值越大，排序越靠前',
          'x-display': 'hidden', // 确保字段隐藏
          'x-decorator': 'FormItem',
          'x-component': 'InputNumber',
          'x-component-props': {},
        },
      },
    },
  },
}
