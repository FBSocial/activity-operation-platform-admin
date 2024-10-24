const complementActionSchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'void',
      'x-component': 'FormLayout',
      'x-component-props': {
        layout: 'horizontal',
      },
      properties: {
        file_url: {
          type: 'string',
          title: '奖品兑换码',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            labelCol: 8,
            wrapperCol: 16,
          },
          'x-component': 'FileUpload',
          'x-component-props': {
            uploadType: 'file',
            fileTypes: ['text/csv'],
            message: 'CSV文件格式',
          },
          'x-validator': [
            {
              required: true,
              whitespace: true,
              message: '请上传对应平台的CDKEY文件',
            },
          ],
        },
      },
    },
  },
}

export default complementActionSchema
