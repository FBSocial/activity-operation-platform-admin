import { deleteActivityListItem, offlineActivityListItem, onlineActivityListItem, type ActivityListItemData } from '@/api/admin'
import { ActivityStatus } from '@/enum/lottery-activity'
import { useMessage } from '@/hooks/useMessage'
import { useResponsiveIframeViewer } from '@/hooks/useResponsiveIframeViewer'
import { copy } from '@/utils/common-func'
import { getGuildId } from '@/utils/storage'
import { previewActivityUrl, previewEncryptActivityUrl } from '@/utils/url'
import type { ActionType } from '@ant-design/pro-components'
import { Button, Popconfirm, Space, Tooltip } from 'antd'
import { useCallback, type MutableRefObject } from 'react'
import DropdownActions from './DropdownActions'
import EditAction from './EditAction'

/**
 * 表格操作组件
 *
 * 该组件用于显示活动列表项的操作按钮，包括预览、编辑、上线、下线和删除等操作。
 *
 * @param {Object} props - 组件属性
 * @param {ActivityListItemData} props.record - 活动列表项数据
 * @returns {JSX.Element} 返回包含操作按钮的 JSX 元素
 */
const TableOptions: React.FC<{ record: ActivityListItemData; actionRef?: MutableRefObject<ActionType | undefined> }> = ({ record, actionRef }) => {
  const messageApi = useMessage()
  const { openDrawer: responsiveIframeViewer } = useResponsiveIframeViewer()

  /**
   * 处理打开预览抽屉
   */
  const handleOpenPreviewDrawer = useCallback(
    (evt: React.MouseEvent<HTMLElement>) => {
      evt.stopPropagation()
      responsiveIframeViewer(previewActivityUrl(record?.activity_id ?? ''), `活动ID: ${record?.activity_id}`, {
        width: 650,
        onCopy: content => {
          if (record?.activity_id && typeof content === 'string') {
            const url = previewEncryptActivityUrl(record?.activity_id)
            console.log('%c Line:32 🍏 url', 'color:#93c0a4', url)
            copy(url)
          }
        },
      })
    },
    [responsiveIframeViewer, record?.activity_id]
  )

  /**
   * 上线活动
   */
  const handleOnlineActivity = async () => {
    try {
      const guildId = getGuildId()
      if (guildId) {
        const res = await onlineActivityListItem({
          activity_id: record.activity_id,
          guild_id: guildId,
        })
        if (res) {
          messageApi.success(`上线活动成功，活动 ID: ${res?.activity_id}`)
          if (actionRef) {
            actionRef?.current?.reload()
          }
        }
      }
    } catch (error) {
      console.error('上线活动失败', error)
    }
  }

  /**
   * 下线活动
   */
  const handleOfflineActivity = async () => {
    try {
      const guildId = getGuildId()
      if (guildId) {
        const res = await offlineActivityListItem({
          activity_id: record.activity_id,
          guild_id: guildId,
        })
        if (res) {
          messageApi.success(`下线活动成功，活动 ID 活动 ID: ${res?.activity_id}`)
          if (actionRef) {
            actionRef?.current?.reload()
          }
        }
      }
    } catch (error) {
      console.error('下线活动失败', error)
    }
  }
  /**
   * 删除活动
   */
  const handleDeleteActivity = async () => {
    try {
      const guildId = getGuildId()
      if (guildId) {
        const res = await deleteActivityListItem({
          activity_id: record.activity_id,
          guild_id: guildId,
        })
        if (res) {
          messageApi.success(`删除活动成功,活动 ID: ${record.activity_id}`)
          if (actionRef) {
            actionRef?.current?.reload()
          }
        }
      }
    } catch (error) {
      console.error('删除活动成功失败', error)
    }
  }

  return (
    <Space size="small" direction="vertical" style={{ width: '100%' }}>
      {record.status === ActivityStatus.Delete ?
        <Tooltip title="点击预览活动页">
          <Button type="link" onClick={handleOpenPreviewDrawer}>
            查看
          </Button>
        </Tooltip>
      : <>
          <Space size="small">
            <Tooltip title="点击预览活动页">
              <Button type="link" onClick={handleOpenPreviewDrawer}>
                查看
              </Button>
            </Tooltip>
            <EditAction record={record} />
          </Space>

          <Space size="small">
            {(record.status === ActivityStatus.NotStarted || record.status === ActivityStatus.Ended) && (
              <Popconfirm
                title={`确定要上线该活动【ID:${record.activity_id}】吗？`}
                onConfirm={handleOnlineActivity}
                okText="确定"
                cancelText="取消"
                placement="bottom"
              >
                <Tooltip title="上线后不可编辑">
                  <Button type="link">上线</Button>
                </Tooltip>
              </Popconfirm>
            )}

            {record.status === ActivityStatus.Started && (
              <Popconfirm
                title={`确定要下线该活动【ID:${record.activity_id}】吗？`}
                onConfirm={handleOfflineActivity}
                okText="确定"
                cancelText="取消"
                placement="bottom"
              >
                <Tooltip title="下线该活动，请慎重！">
                  <Button type="link">下线</Button>
                </Tooltip>
              </Popconfirm>
            )}

            <Popconfirm
              title={`确定要删除活动【ID:${record.activity_id}】吗？`}
              onConfirm={handleDeleteActivity}
              okText="确定"
              cancelText="取消"
              placement="bottom"
            >
              <Tooltip title="活动未上线或已下线、已结束状态支持删除，进行中需下线后才可操作">
                <Button type="link" danger disabled={!(record.status === ActivityStatus.NotStarted || record.status === ActivityStatus.Ended)}>
                  删除
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>

          <DropdownActions record={record} />
        </>
      }
    </Space>
  )
}

export default TableOptions
