import { ISchema } from '@formily/react'

// 基础信息
const schema: ISchema = {
  type: 'object',
  properties: {
    template_type: {
      type: 'string',
      title: '抽奖样式',
      description: '抽奖机的玩法选择，保存后不可更改',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 'squared_paper',
      enum: [
        { label: '大转盘', value: 'the_big_wheel' },
        { label: '九宫格', value: 'squared_paper' },
      ],
      'x-component-props': {},
      'x-validator': [
        {
          required: true,
          whitespace: true,
        },
      ],
    },
    name: {
      type: 'string',
      title: '活动名称',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入活动名称',
        maxLength: 20,
        showCount: true,
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请输入活动名称',
        },
      ],
    },
    rule: {
      type: 'string',
      title: '活动规则',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '请输入活动规则',
        showCount: true,
        maxLength: 2000,
        autoSize: { minRows: 5 },
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请输入活动规则',
        },
      ],
    },
    start_end_time: {
      type: 'string',
      title: '活动时间',
      'x-decorator': 'FormItem',
      'x-component': 'DatePicker.RangePicker',
      'x-component-props': {
        showTime: true,
        placeholder: ['活动开始时间', '活动结束时间'],
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请选择活动开始和结束的时间',
        },
      ],
    },
    priority: {
      type: 'number',
      title: '优先展示',
      description: '决定「抽奖区」和「任务区」的上下位置',
      default: 1,
      enum: [
        {
          label: '抽奖机',
          value: 1,
        },
        {
          label: '任务区',
          value: 2,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-validator': [
        {
          required: true,
          message: '请选择优先展示',
        },
      ],
    },
    share_data: {
      type: 'object',
      title: '分享配置',
      description: '可以自定义活动的站内、站外分享文案和图片',
      'x-decorator': 'FormItem',
      'x-component': 'ConfigurableShareField',
      'x-component-props': {
        buttonName: '点击配置',
        showTooltip: true,
      },
      'x-validator': [
        {
          required: true,
          message: '请设置分享配置的风格和文案',
        },
      ],
    },
  },
}
export default schema
