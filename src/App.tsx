import MessageContext from '@/contexts/MessageContext'
import { ConfigProvider, message } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import './App.css'
import { AppRouter } from './routes'

dayjs.locale('zh-cn')

function App() {
  const [messageApi, contextHolder] = message.useMessage()
  return (
    <ConfigProvider locale={zhCN}>
      {contextHolder}
      <MessageContext.Provider value={messageApi}>
        <AppRouter></AppRouter>
      </MessageContext.Provider>
    </ConfigProvider>
  )
}

export default App
