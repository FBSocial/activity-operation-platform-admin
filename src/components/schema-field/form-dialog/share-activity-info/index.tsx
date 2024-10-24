import SafeModalForm from '@/components/SafeModalForm'
import { ShareAltOutlined } from '@ant-design/icons'
import type { Field } from '@formily/core'
import { observer, useField } from '@formily/react'
import { toJS } from '@formily/reactive'
import { isEmpty } from '@formily/shared'
import { Button, Space, Tooltip } from 'antd'
import { useMemo } from 'react'
import { shareConfigSchema } from './schema'

interface ConfigurableShareFieldProps {
  buttonName?: string
  value?: Record<string, any>
  readOnly?: boolean
  disabled?: boolean
  showTooltip?: boolean
  onChange?: (values: Record<string, any>) => void
}

const ConfigurableShareField = observer((props: ConfigurableShareFieldProps) => {
  const { buttonName, value, readOnly, disabled, showTooltip, onChange } = props
  const field = useField<Field>()

  const formData = useMemo(() => {
    return toJS(value)
  }, [value])

  return (
    <Space>
      <SafeModalForm
        title={field.title}
        record={value}
        schema={shareConfigSchema}
        onFinish={val => {
          onChange?.(val)
        }}
        trigger={
          <Tooltip title={showTooltip ? (field.description ?? '') : ''} placement="bottom">
            <Button type="default" icon={<ShareAltOutlined />} disabled={disabled || readOnly}>
              {buttonName || '配置'}
            </Button>
          </Tooltip>
        }
      ></SafeModalForm>
      <span className={isEmpty(formData) ? 'text-red-500' : 'text-green-500'}>{isEmpty(formData) ? '未配置' : '已配置'}</span>
    </Space>
  )
})

export default ConfigurableShareField
