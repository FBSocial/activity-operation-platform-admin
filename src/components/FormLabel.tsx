import { Typography } from 'antd'

const FormLabel = ({ level = 5, text, style }: { level: any; text: string; style: React.CSSProperties }) => {
  return (
    <Typography.Title level={level} style={style}>
      {text}
    </Typography.Title>
  )
}

export default FormLabel
