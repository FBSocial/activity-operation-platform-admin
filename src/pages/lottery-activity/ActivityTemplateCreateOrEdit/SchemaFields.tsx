import { LotteryTemplateSection } from '@/constant/schema/lottery-activity/lotteryTemplateSection'
import basicInfoSchema from '@/pages/lottery-activity/schema/base-info'
import bgStyleSchema from '@/pages/lottery-activity/schema/bg-style'
import bindAccountSchema from '@/pages/lottery-activity/schema/bind-game'
import lotteryPrizeConfSchema from '@/pages/lottery-activity/schema/lottery-prize-conf'
import moreActivitySchema from '@/pages/lottery-activity/schema/more-activity'
import taskInfoSchema from '@/pages/lottery-activity/schema/task-info'

export const SchemaFields = {
  BaseInfoSchemaField: ({ createSchemaFieldComponent }) => {
    return createSchemaFieldComponent({
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
      },
      properties: {
        [LotteryTemplateSection.BasicInfo.key]: basicInfoSchema,
      },
    })
  },

  BgStyleSchemaField: ({ createSchemaFieldComponent }) => {
    return createSchemaFieldComponent({
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
      },
      properties: {
        [LotteryTemplateSection.BgStyle.key]: bgStyleSchema,
      },
    })
  },

  BindAccountSchemaField: ({ createSchemaFieldComponent }) => {
    return createSchemaFieldComponent({
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
      },
      properties: {
        [LotteryTemplateSection.BindAccount.key]: bindAccountSchema,
      },
    })
  },

  LotteryPrizeConfSchemaField: ({ createSchemaFieldComponent }) => {
    return createSchemaFieldComponent({
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
      },
      properties: {
        [LotteryTemplateSection.LotteryPrizeConf.key]: lotteryPrizeConfSchema,
      },
    })
  },

  MoreActivitySchemaField: ({ createSchemaFieldComponent }) => {
    return createSchemaFieldComponent({
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
      },
      properties: {
        [LotteryTemplateSection.MoreActivity.key]: moreActivitySchema,
      },
    })
  },

  TaskInfoSchemaField: ({ createSchemaFieldComponent }) => {
    return createSchemaFieldComponent({
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
      },
      properties: {
        [LotteryTemplateSection.TaskInfo.key]: taskInfoSchema,
      },
    })
  },
}
