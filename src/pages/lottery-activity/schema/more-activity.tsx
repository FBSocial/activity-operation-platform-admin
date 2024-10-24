import { ISchema } from '@formily/react'

// 基础信息
const schema: ISchema = {
  type: 'object',
  properties: {
    more_title: {
      type: 'string',
      title: '标题图片',
      description: '例：更多福利活动',
      'x-decorator': 'FormItem',
      'x-decorator-props': {},
      'x-component': 'FileUpload',
      'x-component-props': {
        message: '图片尺寸\n建议1073x120px（可以不限制高度）',
        fileSize: 3 * 1024,
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请上传标题图片',
        },
      ],
    },
    more_activity: {
      type: 'array',
      title: '活动添加',
      'x-decorator': 'FormItem',
      'x-component': 'ConfigurableMoreActivityInfo',
      'x-component-props': {
        buttonName: '添加',
      },
      'x-validator': [
        {
          required: true,
          whitespace: true,
          message: '请添加更多活动',
        },
      ],
    },
  },
}
export default schema
