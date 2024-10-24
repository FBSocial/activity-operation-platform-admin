import { getActivityList, type ActivityListItemData } from '@/api/admin'
import { useMessage } from '@/hooks/useMessage'
import { getGuildId } from '@/utils/storage'
import { PlusOutlined } from '@ant-design/icons'
import type { ActionType, ProColumnType, ProFormInstance } from '@ant-design/pro-components'
import { ProCard, ProTable } from '@ant-design/pro-components'
import { useRequest } from 'ahooks'
import { Button, Space, Tooltip } from 'antd'
import type { SortOrder } from 'antd/es/table/interface'
import { useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import TableOptions from './table-options'

const config = {
  bordered: true,
  size: 'small',
  expandable: false,
  headerTitle: '抽奖活动列表',
  tooltip: '活动列表',
  showHeader: true,
  footer: false,
  rowSelection: false,
  scroll: {
    y: '100%',
  },
  tableLayout: undefined,
  toolBarRender: true,
  options: {
    show: true,
    density: false,
    fullScreen: true,
    setting: true,
  },
  ellipsis: true,
  copyable: false,
}

export const ActivityTableList = () => {
  const formRef = useRef<ProFormInstance<ActivityListItemData>>()
  const actionRef = useRef<ActionType>()
  const location = useLocation()
  const messageApi = useMessage()
  const { loading, runAsync } = useRequest(getActivityList, { manual: true })
  const navigate = useNavigate()

  const columns: ProColumnType<ActivityListItemData>[] = useMemo(
    () => [
      {
        title: '活动ID',
        dataIndex: 'activity_id', // 修正 dataIndex
        ellipsis: true,
        align: 'center',
        copyable: true,
      },
      {
        title: '活动标题',
        dataIndex: 'name',
        copyable: true,
      },
      {
        title: '创建人',
        dataIndex: 'created_by',
        valueType: 'text',
        search: false,
      },
      {
        title: '创建时间',
        sorter: (a, b) => a.created_at - b.created_at,
        dataIndex: 'created_at',
        valueType: 'dateTime', // 使用 dateTime 类型
        search: false,
        // render: (_, record) => dayjs.unix(record.created_at).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '更新时间',
        sorter: (a, b) => a.updated_at - b.updated_at,
        dataIndex: 'updated_at',
        valueType: 'dateTime', // 使用 dateTime 类型
        search: false,
        // render: (_, record) => dayjs.unix(record.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '活动开始-结束时间',
        dataIndex: 'start_end_time',
        valueType: 'dateTimeRange', // 使用 dateTimeRange 类型
        render: (_, record) => {
          return (
            <Space direction="vertical">
              <span>{record.start_end_time[0]}</span>
              <span>至</span>
              <span>{record.start_end_time[1]}</span>
            </Space>
          )
        },
        width: 200,
        align: 'center',
      },
      {
        title: '活动状态',
        dataIndex: 'status',
        valueType: 'select',
        align: 'center',
        search: true,
        valueEnum: {
          0: { text: '活动未上线', status: 'Default' },
          1: { text: '活动已上线', status: 'Success' },
          2: { text: '活动已结束', status: 'Warning' },
          3: { text: '活动被删除', status: 'Error' },
        },
      },
      {
        title: '上线过的日期',
        sorter: (a, b) => a.online_at - b.online_at,
        dataIndex: 'online_at',
        valueType: 'dateTime', // 使用 dateTime 类型
        search: false,
        ellipsis: true,
      },
      {
        title: '操作',
        key: 'action',
        valueType: 'option',
        width: 200,
        fixed: 'right',
        align: 'center',
        render: (_, record) => {
          return <TableOptions record={record} actionRef={actionRef} />
        },
      },
    ],
    []
  )

  const handleTableRequest = async (params: any, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
    const { current, pageSize, activity_id, name, status, start_end_time } = params
    const queryParams = {
      page: current,
      activity_id,
      name,
      status,
      start_time: Array.isArray(start_end_time) && start_end_time.length > 0 ? start_end_time[0] : undefined,
      end_time: Array.isArray(start_end_time) && start_end_time.length > 0 ? start_end_time[1] : undefined,
      size: pageSize,
    }

    try {
      const { data, total } = await fetchActivityList(queryParams)
      return {
        success: true,
        data: data as any,
        total: total, // 注意：这里可能需要从后端获取总数
      }
    } catch (error) {
      messageApi.error('获取活动列表失败')
      return {
        success: false,
        data: [],
        total: 0,
      }
    }
  }

  const fetchActivityList = async (params = {}) => {
    const guildId = getGuildId()
    if (!guildId) {
      throw new Error('Guild ID not found')
    }
    const resData = await runAsync(undefined, params)
    const data = resData?.lists?.map(item => {
      return {
        ...item,
        start_end_time: [item.start_time, item.end_time],
      }
    })
    return {
      data,
      total: resData.total,
    }
  }

  const handleNewActivity = () => {
    navigate('/admin/lottery-activity/create')
  }

  useEffect(() => {
    if (location.state?.key) {
      actionRef.current?.reload()
    }
  }, [location.state])

  return (
    <ProCard
      style={{
        overflow: 'auto',
      }}
    >
      <ProTable
        loading={loading}
        request={handleTableRequest}
        formRef={formRef}
        actionRef={actionRef}
        pagination={{
          showSizeChanger: true,
        }}
        form={{
          ignoreRules: true,
        }}
        search={{
          defaultCollapsed: false,
          span: 12, // 调整搜索栏的宽度
          labelWidth: 130,
        }}
        toolBarRender={() => [
          <Tooltip title="点击创建新的抽奖活动">
            <Button key="button" icon={<PlusOutlined />} onClick={handleNewActivity} type="primary">
              新建活动
            </Button>
          </Tooltip>,
        ]}
        options={config.options?.show ? config.options : {}}
        headerTitle={config.headerTitle}
        columns={columns}
        scroll={{ y: '100%' }}
      />
    </ProCard>
  )
}

export default ActivityTableList
