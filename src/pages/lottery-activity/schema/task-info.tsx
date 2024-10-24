import { ISchema } from '@formily/react'

// 基础信息
const schema: ISchema = {
  type: 'object',
  properties: {
    task_number: {
      type: 'string',
      title: '任务上限个数',
      description: '决定活动最终展现的任务个数，不建议过多',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 5,
      enum: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        // { label: '6', value: 6 },
        // { label: '7', value: 7 },
        // { label: '8', value: 8 },
        // { label: '9', value: 9 },
        // { label: '10', value: 10 },
        // { label: '11', value: 11 },
        // { label: '12', value: 12 },
        // { label: '13', value: 13 },
        // { label: '14', value: 14 },
        // { label: '15', value: 15 },
        // { label: '16', value: 16 },
        // { label: '17', value: 17 },
        // { label: '18', value: 18 },
        // { label: '19', value: 19 },
        // { label: '20', value: 20 },
      ],
      'x-component-props': {},
      'x-validator': [
        {
          required: true,
          whitespace: true,
        },
      ],
    },
    task_array: {
      type: 'array',
      title: '添加任务',
      description: '受限于任务上限个数，请合理配置',
      'x-decorator': 'FormItem',
      'x-component': 'TaskDragTableFormField',
      'x-component-props': {
        buttonName: '添加任务',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请配置任务',
        },
      ],
    },
  },
}
export default schema
