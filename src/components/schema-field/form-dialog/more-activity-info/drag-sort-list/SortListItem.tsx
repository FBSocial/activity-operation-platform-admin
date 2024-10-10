import ImagePreview from '@/components/ImagePreview'
import { type SortableItemProps } from '@/components/SortableList'
import { Button, Card, Space, Typography } from 'antd'
type SortableItemChildrenProps<T extends SortableItemProps<'item'>> = {
  dataSource: T
  onClick?: (data: T) => void
}

const SortListItem = ({ dataSource, onClick }: SortableItemChildrenProps<any>) => {
  const data = dataSource
  const handleClick = (action: 'edit' | 'remove') => {
    onClick?.({
      type: action,
      ...dataSource,
    })
  }

  return (
    <Card
      type="inner"
      size="small"
      className="w-full"
      bordered={false}
      cover={
        <div className="!flex w-full items-center justify-center">
          <ImagePreview
            width={320}
            height={160}
            src={data?.banner ?? 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'}
          />
        </div>
      }
    >
      <Card.Meta
        description={
          <div>
            <div className="w-full">
              <Typography.Text strong style={{ width: 70, display: 'inline-block' }}>
                活动标题:
              </Typography.Text>
              <Typography.Text copyable={!!data?.title} ellipsis={{ tooltip: data?.url }} style={{ width: 200 }}>
                {data?.title}
              </Typography.Text>
            </div>
            <div className="w-full">
              <Typography.Text strong style={{ width: 70, display: 'inline-block' }}>
                活动链接：
              </Typography.Text>
              <Typography.Text underline copyable={!!data?.url} ellipsis={{ tooltip: data?.url }} style={{ width: 200 }}>
                {data?.url}
              </Typography.Text>
            </div>
            <div className="flex w-full items-center justify-center">
              <Space>
                <Button type="link" onClick={() => handleClick('edit')}>
                  编辑
                </Button>
                <Button type="link" onClick={() => handleClick('remove')}>
                  删除
                </Button>
              </Space>
            </div>
          </div>
        }
      ></Card.Meta>
    </Card>
  )
}

export default SortListItem
