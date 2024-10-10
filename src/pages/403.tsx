import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const NoAuthAccessPage: React.FC = () => {
  const navigate = useNavigate()
  console.log('%c Line:7 🍰 navigate', 'color:#2eafb0', navigate)
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Result
        status="403"
        title="403"
        subTitle={'抱歉，你没有访问此页面的权限。'}
        extra={
          <Button type="primary" onClick={() => navigate('/login', { replace: true })}>
            返回登录页
          </Button>
        }
      />
    </div>
  )
}

export default NoAuthAccessPage
