import { phoneLogin, sendSms } from '@/api/login'
import { useMessage } from '@/hooks/useMessage'
import { setToken, setUserInfo } from '@/utils/storage'
import { LockOutlined, MobileOutlined } from '@ant-design/icons'
import { LoginForm, ProConfigProvider, ProFormCaptcha, ProFormText, type ProFormInstance } from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Tabs } from 'antd'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type LoginType = 'phone' | 'account'

const Login = () => {
  const [loginType, setLoginType] = useState<LoginType>('phone')
  const formRef = useRef<ProFormInstance>()
  const messageApi = useMessage()

  const navigate = useNavigate()

  // 使用 useRequest 处理发送验证码的异步请求
  const { loading: smsLoading, runAsync: sendSmsRequest } = useRequest(sendSms, {
    manual: true,
  })
  const { runAsync: phoneLoginRequest } = useRequest(phoneLogin, { manual: true })

  const tabItems = [
    {
      key: 'phone',
      label: '手机号登录',
      children: (
        <>
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined className={'prefixIcon'} />,
              maxLength: 11,
            }}
            name="mobile"
            placeholder={'手机号'}
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <ProFormCaptcha
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
              disabled: smsLoading, // 根据 smsLoading 状态禁用按钮
              allowClear: true,
            }}
            captchaProps={{
              size: 'large',
              loading: smsLoading,
            }}
            placeholder={'请输入验证码'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'获取验证码'}`
              }
              return '获取验证码'
            }}
            name="code"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
            phoneName="mobile"
            onGetCaptcha={async (mobile: string) => {
              console.log('%c Line:81 🍣 mobile', 'color:#ed9ec7', mobile)
              await formRef?.current?.validateFields(['mobile'])

              console.log('%c Line:75 🥕', 'color:#3f7cff', 121312)
              try {
                const params = {
                  mobile,
                  area_code: '86',
                }
                await sendSmsRequest(params)
                messageApi?.success('验证码发送成功')
              } catch (error) {
                console.error('验证码发送失败:', error)
              }
            }}
          />
        </>
      ),
    },
  ]

  const handleFormFinish = async (values: any) => {
    console.log('Form values:', values)
    await formRef.current?.validateFields()
    if (loginType === 'phone') {
      try {
        const params = {
          ...values,
          area_code: '86',
        }
        const res = await phoneLoginRequest(params)
        if (res) {
          setUserInfo(res)
          setToken(res.sign)
          messageApi?.success('登录成功')
          // TODO: 登录成功后跳转
          navigate('/admin', { replace: true })
        }
      } catch (error) {
        console.log('%c Line:110 🍆 error', 'color:#b03734', error)
      }
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <ProConfigProvider hashed={false}>
        <div style={{ color: '#050505' }}>
          <LoginForm logo="" title="活动运营平台" subTitle="" actions={null} onFinish={handleFormFinish} formRef={formRef}>
            <Tabs centered activeKey={loginType} onChange={activeKey => setLoginType(activeKey as LoginType)} items={tabItems} />
          </LoginForm>
        </div>
      </ProConfigProvider>
    </div>
  )
}

export default Login
