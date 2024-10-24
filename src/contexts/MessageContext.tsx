import type { MessageInstance } from 'antd/es/message/interface'
import { createContext } from 'react'

const MessageContext = createContext<null | MessageInstance>(null)

export default MessageContext
