import type { ActivityListItemData } from '@/api/admin'
import { Button } from 'antd'
import ComplementDrawerForm from './ComplementDrawerForm'

/**
 * ComplementAction 组件
 * 用于触发补码操作的按钮组件
 * @param {ActivityListItemData} record - 活动 ID
 * @returns {JSX.Element} 返回一个包含补码操作按钮的组件
 */
export default function ComplementAction({ record }: { record: ActivityListItemData }): JSX.Element {
  return <ComplementDrawerForm trigger={<Button type="link">补码</Button>} record={record} />
}
