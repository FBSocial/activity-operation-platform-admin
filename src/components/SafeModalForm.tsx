import useFormilyForm from '@/hooks/useFormilyForm'
import { ModalForm, ModalFormProps } from '@ant-design/pro-components'
import { FormProvider, ISchema } from '@formily/react'
import React, { useCallback, useMemo } from 'react'

/**
 * SafeModalForm 组件的属性接口
 * @template T - 记录对象的类型（后端API返回的数据类型）
 * @template U - 表单数据的类型（可能与记录对象类型不同）
 */
export interface SafeModalFormProps<T extends Record<string, any>, U = T> extends Pick<ModalFormProps, 'trigger'> {
  /** 模态框的标题 */
  title: string

  /** 初始记录对象，用于编辑时 */
  record?: T

  /** 表单提交成功后的回调函数 */
  onFinish?: (value: T) => void | Promise<void>

  /** 表单的 schema */
  schema: ISchema

  /** 其他模态框相关的属性 */
  modalProps?: ModalFormProps['modalProps']

  /** 数据映射函数，用于初始化和提交时的数据转换 */
  dataMapper?: {
    toForm?: (record: T) => U
    fromForm?: (formData: U) => T
  }

  /** 表单的作用域，用于共享数据和方法 */
  scope?: Record<string, any>
}

/**
 * 一个安全的模态框表单组件，集成了 Formily 和 Ant Design Pro 组件。
 * 支持数据转换、类型安全，并具有良好的可读性和可维护性。
 * @template T - 记录对象的类型（后端API返回的数据类型）
 * @template U - 表单数据的类型（可能与记录对象类型不同）
 */
function SafeModalForm<T extends Record<string, any>, U = T>({
  trigger,
  record,
  onFinish,
  schema,
  title,
  modalProps,
  dataMapper = {},
  scope = {},
}: SafeModalFormProps<T, U>): React.ReactElement | null {
  // 使用自定义钩子初始化表单和模板字段
  const { form, templateField } = useFormilyForm({ schema, scope })

  // 使用 useMemo 优化性能，避免不必要的重新渲染
  const memoizedTitle = useMemo(() => `${record ? '编辑' : '新建'}${title}`, [record, title])

  // 处理模态框打开时的逻辑
  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (!form) return

      if (val && record) {
        if (typeof dataMapper?.toForm === 'function') {
          const formData = dataMapper.toForm(record)
          form.setValues(formData)
        } else {
          form.setValues(record)
        }
      } else {
        form.reset()
      }
    },
    [form, record, dataMapper]
  )

  // 处理表单提交
  const handleFinish = useCallback(async () => {
    if (!form) return false

    try {
      const formData = (await form.submit()) as U
      const submitData = typeof dataMapper?.fromForm === 'function' ? dataMapper.fromForm(formData) : formData
      await onFinish?.(submitData as T)
      return true
    } catch (error) {
      console.error('表单提交失败:', error)
      return false
    }
  }, [form, dataMapper, onFinish])

  // 如果表单未初始化，返回 null
  if (!form) {
    return null
  }

  return (
    <ModalForm
      title={memoizedTitle}
      width={600}
      modalProps={{
        destroyOnClose: true,
        ...modalProps,
      }}
      onOpenChange={handleOpenChange}
      onFinish={handleFinish}
      trigger={trigger}
    >
      <FormProvider form={form}>{templateField}</FormProvider>
    </ModalForm>
  )
}

export default SafeModalForm
