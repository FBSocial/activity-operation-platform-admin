import { SaveOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { Button, Popconfirm, Space } from 'antd'
import { useState } from 'react'

interface SectionCardProps {
  title: string
  onSubmit: () => void
  children: React.ReactNode
  needConfirm?: boolean
  confirmTitle?: string
  saveText?: string
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, onSubmit, children, needConfirm = false, confirmTitle, saveText = '保存' }) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    onSubmit()
    await new Promise(resolve => setTimeout(resolve, 500))
    setLoading(false)
  }

  return (
    <ProCard
      size="small"
      title={title}
      bordered
      headerBordered
      actions={
        <div className="flex items-center justify-center">
          <Space>
            {needConfirm ?
              <Popconfirm title={confirmTitle} onConfirm={handleSubmit} okText="确定" cancelText="取消" placement="bottom">
                <Button icon={<SaveOutlined />} type="primary" loading={loading}>
                  {saveText}
                </Button>
              </Popconfirm>
            : <Button icon={<SaveOutlined />} type="primary" onClick={handleSubmit} loading={loading}>
                {saveText}
              </Button>
            }
          </Space>
        </div>
      }
    >
      {children}
    </ProCard>
  )
}
