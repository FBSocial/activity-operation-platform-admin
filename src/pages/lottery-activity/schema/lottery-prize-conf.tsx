import { LotteryTemplateSection } from '@/constant/schema/lottery-activity/lotteryTemplateSection'
import { ISchema } from '@formily/react'

// 基础信息
const schema: ISchema = {
  type: 'object',
  properties: {
    draw_num: {
      type: 'number',
      title: '奖品个数',
      description: '总个数涵盖保底奖品,选项配置个数由抽奖玩法决定',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 4,
      enum: [
        { label: '4', value: 4 },
        { label: '6', value: 6 },
        { label: '8', value: 8 },
        { label: '10', value: 10 },
      ],
      'x-component-props': {},
      'x-validator': [
        {
          required: true,
          message: '请选择奖品个数',
        },
      ],
    },
    draw_gift_array: {
      type: 'array',
      title: '奖品详情',
      'x-decorator': 'FormItem',
      'x-component': 'LotteryDragTableFormField',
      'x-component-props': {
        buttonName: '添加常规奖品',
      },
      'x-validator': [
        {
          required: true,
          message: '请添加常规奖品',
        },
        {
          validator: (value, rule, ctx) => {
            const form = ctx.form
            const drawNum = form?.getValuesIn(`${LotteryTemplateSection.LotteryPrizeConf.key}.draw_num`)
            if (typeof drawNum !== 'number') {
              return '请先选择奖品个数'
            }
            if (!Array.isArray(value)) {
              return '奖品详情必须是一个数组'
            }
            if (value.length !== drawNum) {
              return `奖品总数量[常规+保底奖品]必须等于${drawNum}`
            }
            return ''
          },
          triggerType: 'onSubmit',
        },
      ],
      'x-reactions': [
        {
          dependencies: ['.draw_num'],
          fulfill: {
            state: {
              value:
                '{{$deps[0] && Array.isArray($self.value) ? ($self.value.length > $deps[0] ? $self.value.slice(0, $deps[0]) : $self.value) : $self.value}}',
              errors:
                '{{$deps[0] && Array.isArray($self.value) && $self.value.length !== $deps[0] ? [`奖品总数量[常规+保底奖品]必须等于${$deps[0]}`] : null}}',
            },
          },
        },
      ],
    },
    draw_guaranteed: {
      type: 'object',
      title: '保底奖品',
      description: '配置谢谢惠顾，就是没抽到的时候使用',
      'x-decorator': 'FormItem',
      'x-component': 'LotteryGuaranteedField',
      'x-component-props': {
        buttonName: '添加保底奖品',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请添加保底奖品',
        },
      ],
    },
    draw_button_img: {
      type: 'string',
      title: '抽奖按钮',
      description: '抽奖机启动按钮的文案，例：立即抽奖/扭一扭的图片',
      'x-decorator': 'FormItem',
      'x-decorator-props': {},
      'x-component': 'FileUpload',
      'x-component-props': {
        message: '图片尺寸\n建议上传 360px * 360px 的图片',
        fileSize: 3 * 1024,
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请上传奖品小图',
        },
      ],
    },
    draw_img: {
      type: 'string',
      title: '抽奖机外观',
      description: '抽奖机的背景图需要包含奖品，按照配置的奖品数量和位置进行配置，保底是最后一个',
      'x-decorator': 'FormItem',
      'x-decorator-props': {},
      'x-component': 'FileUpload',
      'x-component-props': {
        message: '图片尺寸\n建议上传 1074px*1074px 的图片',
        fileSize: 80 * 1024,
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
        },
      ],
    },
  },
}
export default schema
