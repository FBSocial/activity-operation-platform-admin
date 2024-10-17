import type { ActivityListItemData } from '@/api/admin'
import { WhiteListModal } from '@/pages/components/white-list-modal-form'
import { DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button, Dropdown } from 'antd'
import ComplementAction from './complement-action'
import CopyAction from './CopyAction'

const DropdownActions = ({ record }: { record: ActivityListItemData }) => {
  const items: MenuProps['items'] = [
    {
      key: 'whitelist',
      label: <WhiteListModal activityId={record.activity_id} />,
    },
    {
      key: 'copy',
      label: <CopyAction record={record} />,
    },
    {
      key: 'complement',
      label: <ComplementAction record={record} />,
    },
  ]
  return (
    <Dropdown menu={{ items }}>
      <Button type="link" icon={<DownOutlined />} iconPosition="end">
        更多
      </Button>
    </Dropdown>
  )
}

export default DropdownActions
