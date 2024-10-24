import useFormilyForm from '@/hooks/useFormilyForm'
import { FormProvider, observer } from '@formily/react'
import { Button, Modal } from 'antd'
import { useEffect, useState } from 'react'

type FormData = {
  id: string | number
  data: any
}

type FormModalProps = {
  title: string
  visible: boolean
  formStatusType: 'add' | 'edit'
  onOk: (formData: FormData) => void
  onCancel?: () => void
  formData: FormData
  schema: any // 这里应该是您的表单 schema
  onChange?: (formData: FormData) => void
}

const FormModal = observer(({ visible, onOk, onCancel, title, formData, formStatusType, schema, onChange }: FormModalProps) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { form: modalForm, templateField } = useFormilyForm({ schema })

  useEffect(() => {
    setModalVisible(visible)
  }, [visible])

  useEffect(() => {
    if (formData) {
      modalForm.setValues(formData)
    }
  }, [formData, modalForm])

  const handleCloseModal = () => {
    modalForm.reset()
    setModalVisible(false)
    onCancel?.()
  }

  const handleConfirm = async () => {
    try {
      await modalForm.validate()
      const values = modalForm.values
      onOk({
        ...formData,
        ...values,
      })
      onChange?.(values)
      setModalVisible(false)
      modalForm.reset()
    } catch (error) {
      console.error(error)
      // 可以在这里添加用户反馈逻辑
    }
  }

  const renderFooter = () => [
    <Button key="cancel" onClick={handleCloseModal}>
      取消
    </Button>,
    <Button key="save" type="primary" onClick={handleConfirm}>
      保存
    </Button>,
  ]

  return (
    <Modal
      centered
      width={650}
      maskClosable={false}
      title={formStatusType === 'add' ? title : '编辑'}
      open={modalVisible}
      onCancel={handleCloseModal}
      footer={renderFooter()}
    >
      {templateField && modalForm ?
        <FormProvider form={modalForm}>{templateField}</FormProvider>
      : null}
    </Modal>
  )
})

export default FormModal
