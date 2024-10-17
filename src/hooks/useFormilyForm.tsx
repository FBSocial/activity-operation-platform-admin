import { ProCard } from '@ant-design/pro-components'
import { ArrayItems, ArrayTabs, Checkbox, DatePicker, FormItem, FormLayout, Input, Radio, Select, Space, Switch, TimePicker } from '@formily/antd-v5'
import { createForm, IFormProps, isForm } from '@formily/core'
import { createSchemaField, ISchema, type ISchemaFieldReactFactoryOptions } from '@formily/react'
import { Card, ColorPicker, Divider, InputNumber, Tabs } from 'antd'
import { useMemo } from 'react'

// 自定义组件
import CardUpload from '@/components/CardUpload'
import FormLabel from '@/components/FormLabel'
import { LotteryDragTableFormField, LotteryGuaranteedField } from '@/components/schema-field/form-dialog/lottery-setting-info'
import ConfigurableMoreActivityInfo from '@/components/schema-field/form-dialog/more-activity-info'
import ConfigurableShareField from '@/components/schema-field/form-dialog/share-activity-info'
import { TaskDragTableFormField } from '@/components/schema-field/form-dialog/task-setting-info'
import GuildDataSelect from '@/components/schema-field/GuildDataSelect'
import TaskFrequencySelect from '@/components/schema-field/select/task-frequency-select'
import TaskRewardCountSelect from '@/components/schema-field/select/task-reward-count-select'
import TaskTypeSelect from '@/components/schema-field/select/task-type-select'
import FileUpload from '@/components/schema-field/upload/FileUpload'
import Upload from '@/components/schema-field/upload/Upload'

/**
 * 定义表单组件映射
 */
const schemaFieldComponents = {
  // Ant Design 组件
  antd: {
    Card,
    ColorPicker,
    Divider,
    InputNumber,
    Tabs,
  },
  // Formily Ant Design v5 组件
  formilyAntdV5: {
    ArrayItems,
    ArrayTabs,
    Checkbox,
    DatePicker,
    FormItem,
    FormLayout,
    Input,
    Radio,
    Select,
    Space,
    Switch,
    TimePicker,
  },
  // 自定义组件
  custom: {
    CardUpload,
    ConfigurableMoreActivityInfo,
    ConfigurableShareField,
    GuildDataSelect,
    FileUpload,
    FormLabel,
    LotteryDragTableFormField,
    LotteryGuaranteedField,
    ProCard,
    TaskDragTableFormField,
    TaskFrequencySelect,
    TaskTypeSelect,
    TaskRewardCountSelect,
    Upload,
  },
}

type useFormilyFormPropsType = {
  schema?: ISchema
  createFormProps?: IFormProps
  components?: Record<string, unknown>
  scope?: ISchemaFieldReactFactoryOptions
}

/**
 * 自定义 Hook，用于创建和管理 Formily 表单
 * @param schema - 表单的 JSON Schema
 * @param createFormProps - 创建表单时的额外参数
 * @param components - 自定义组件映射
 * @param scope - 表单的作用域，用于共享数据和方法
 * @returns 包含表单实例和模板字段的对象
 */
const useFormilyForm = ({ schema, createFormProps, components = {}, scope = {} }: useFormilyFormPropsType) => {
  /**
   * 使用 useMemo 缓存表单实例，避免不必要的重新创建
   */
  const form = useMemo(() => {
    const formInstance = createForm(createFormProps)
    // 检查 formInstance 是否为有效的 Form 对象
    if (!isForm(formInstance)) {
      throw new Error('Failed to create a valid Form instance.')
    }
    return formInstance
  }, [createFormProps])

  /**
   * 创建合并后的组件对象
   */
  const allComponents = useMemo(
    () => ({
      ...schemaFieldComponents.antd,
      ...schemaFieldComponents.formilyAntdV5,
      ...schemaFieldComponents.custom,
      ...components,
    }),
    [components]
  )

  /**
   * 使用 useMemo 缓存 SchemaField 组件，避免不必要的重新渲染
   */
  const templateField = useMemo(() => {
    const SchemaField = createSchemaField({
      components: allComponents,
      scope,
    })

    return <SchemaField schema={schema} />
  }, [allComponents, schema, scope])

  /**
   * 创建一个可以根据传入的 schema 动态生成 SchemaField 的组件
   * @param schema - 表单的 JSON Schema
   * @returns 返回一个 React 组件，该组件接受 schema 作为 props
   */
  const createSchemaFieldComponent = (schema: ISchema) => {
    const SchemaField = createSchemaField({
      components: allComponents,
      scope,
    })

    return <SchemaField schema={schema} />
  }

  return {
    form,
    templateField,
    createSchemaFieldComponent,
  }
}

export default useFormilyForm
