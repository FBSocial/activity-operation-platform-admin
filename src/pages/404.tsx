import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NoFoundPage: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Result
        status="404"
        title="404"
        subTitle={'抱歉，你访问的页面不存在。'}
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
