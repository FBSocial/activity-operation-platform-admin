import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NoFoundPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Result
        status="500"
        title="500"
        subTitle={'抱歉，服务端发生错误。'}
        extra={
          <Button type="primary" onClick={() => navigate('/admin')}>
            返回首页
          </Button>
        }
      />
    </div>
  )
}

export default NoFoundPage
