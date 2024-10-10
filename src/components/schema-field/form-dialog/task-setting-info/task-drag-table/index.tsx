import { getActivityTasks, type TaskDetail } from '@/api/admin/activity/task'
import DragTable from '@/components/DragTable'
import SafeModalForm from '@/components/SafeModalForm'
import { useGuildData } from '@/contexts/GuildDataContext'
import { useLotteryActivityId } from '@/contexts/LotteryActivityIdContext'
import { useLotteryActivityData } from '@/contexts/LotteryActivityIdDataContext'
import { getMaxPropertyValue, reorderArrayByProperty } from '@/utils/array-utils'
import { getGuildId } from '@/utils/storage'
import { ShareAltOutlined } from '@ant-design/icons'
import type { ProColumns } from '@ant-design/pro-components'
import type { Field } from '@formily/core'
import { observer, useField } from '@formily/react'
import { Button, message, Space, Tooltip } from 'antd'
import { isEqual } from 'es-toolkit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { taskConfigSchema } from '../schema'
import TableOptions from './TableOptions'
import { getAction, getTaskEventValue } from './utils'

/**
 * TaskDragTableFormField 组件属性接口
 */
interface TaskDragTableFormFieldProps {
  /**
   * 按钮名称
   */
  buttonName?: string
  /**
   * 表单值
   */
  value?: Record<string, any>
  /**
   * 是否只读
   */
  readOnly?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否显示提示
   */
  showTooltip?: boolean
  /**
   * 值改变回调
   * @param values 新的表单值
   */
  onChange?: (values: Record<string, any>) => void
}

/**
 * 任务拖拽表格字段组件
 * @param props 组件属性
 */
export const TaskDragTableFormField = observer((props: TaskDragTableFormFieldProps) => {
  const { buttonName, value, readOnly, disabled, showTooltip, onChange } = props
  const field = useField<Field>()
  const { activityId } = useLotteryActivityId()
  const { activityData } = useLotteryActivityData()
  const { lotteryActivityTaskTypeList } = useGuildData()

  const [tableData, setTableData] = useState<TaskDetail[]>([])

  const scope = useMemo(() => {
    return {
      taskSettingTypeList: (field: Field) => {
        field.dataSource = lotteryActivityTaskTypeList?.taskSettingType?.map(item => ({ label: item.name, value: item.id })) || []
        field.initialValue = field.dataSource[0]?.value
      },
      getSecondTaskList: (field: Field) => {
        const interactionSecondLevel = field.query('.taskSettingType').get('value')
        const sectionTask = lotteryActivityTaskTypeList?.groupByTaskType?.[interactionSecondLevel]
        if (Array.isArray(sectionTask) && sectionTask.length > 0) {
          const dataSource = sectionTask?.map(item => ({ label: item.name, value: item.task_event })) || []
          field.dataSource = dataSource
          field.initialValue = dataSource[0]?.value
        } else {
          field.visible = false
        }
      },
    }
  }, [lotteryActivityTaskTypeList])

  const taskNumber: number = field.query('.task_number').get('value')

  const fetchTableData = useCallback(async () => {
    if (!activityId) return

    try {
      const res = await getActivityTasks(activityId)
      const newData = res.map((item: any, index: number) => ({ ...item, position: res.length - index }))
      setTableData(newData)
    } catch (error) {
      message.error('获取任务列表失败')
    }
  }, [activityId])

  // 修改数据
  const modifyData = useCallback(
    (record: any) => {
      // const newData = tableData.map(item => (item.key === record.key ? { ...record, modified: true } : item))
      // setTableData(newData)
      message.success('编辑成功')
    },
    [tableData]
  )

  /**
   * 删除任务数据
   * @param record 要删除的任务记录
   */
  const deleteData = useCallback(
    async (record: any) => {
      const newData = tableData.filter(item => item.activity_task_id !== record.activity_task_id)
      setTableData(newData)
    },
    [tableData]
  )

  const columns: ProColumns<TaskDetail>[] = useMemo(
    () => [
      {
        title: '任务id',
        search: false,
        dataIndex: 'activity_task_id',
        key: 'id',
      },
      {
        title: '任务名称',
        search: false,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        search: false,
        key: 'operate',
        width: 140,
        align: 'center' as const,
        render: (_, record) =>
          !activityData?.online_at ?
            <TableOptions schema={taskConfigSchema} scope={scope} record={record} onEdit={modifyData} onDelete={deleteData} />
          : <span>不可变更</span>,
      },
    ],
    [activityData?.online_at, scope, modifyData, deleteData]
  )

  // 是否禁用添加任务按钮
  const disabledAddTask = useMemo(() => {
    if (Array.isArray(tableData)) {
      return tableData.length >= taskNumber
    }
    if (disabled || readOnly) return true

    return false
  }, [tableData, disabled, readOnly, taskNumber])

  const handleModalFormSubmit = async (formValue: any) => {
    console.log('%c Line:124 🧀 formValue', 'color:#3f7cff', formValue)
    let formTaskData
    if (activityId) {
      const task_event = getTaskEventValue(formValue, lotteryActivityTaskTypeList?.taskSetting)
      console.log('task_event', task_event)

      if (typeof formValue.position === 'number') {
        if (formValue.position > 255) {
          // 如果 position 大于 255，则对数组进行重排
          const sortedData = reorderArrayByProperty(tableData, 'position', true)
          formTaskData = sortedData.map((item, index) => ({
            ...item,
            position: tableData.length - index,
          }))
          formTaskData = formTaskData.map(item =>
            item.activity_task_id === formValue.activity_task_id ? { ...formValue, position: tableData.length } : item
          )
        } else {
          formTaskData = tableData.map(item => (item.activity_task_id === formValue.activity_task_id ? formValue : item))
        }
      } else {
        const maxPosition = getMaxPropertyValue(tableData, 'position')
        const newPosition = maxPosition < 255 ? maxPosition + 1 : 255
        formTaskData = { ...formValue, position: newPosition }
      }
      const guildId = getGuildId()

      // 目标/社区ID/商城Id/游戏Id/第三方的目标Id，活动ID
      const target_id = ''
      console.log('%c Line:183 🍻 lotteryActivityTaskTypeList', 'color:#4fff4B', lotteryActivityTaskTypeList?.taskSetting)

      // 跳转行为
      const action = getAction(
        {
          ...formValue,
          activity_id: activityId,
        },
        lotteryActivityTaskTypeList?.taskSetting
      )
      console.log('%c Line:193 🍯 action', 'color:#f5ce50', action)
      // 获取任务名称
      const name = () => {
        const taskSetting = lotteryActivityTaskTypeList?.taskSetting
        return taskSetting?.find(item => item.task_event === task_event)?.name || ''
      }

      const params = {
        ...formTaskData,
        activity_id: activityId,
        task_event,
        guild_id: guildId,
        target_id,
        name: name(),
      }
      console.log('%c Line:181 🍑', 'color:#f5ce50', params)
      // await createTask(activityId, params)
      // // 提交成功后重新获取表格数据
      // await fetchTableData()
    }
  }

  useEffect(() => {
    if (Array.isArray(tableData)) {
      const newData = tableData.map((item, index) => ({
        activity_task_id: item.activity_task_id,
        position: tableData.length - index,
      }))

      if (!isEqual(newData, value)) {
        onChange?.(newData)
      }
    } else if (value !== undefined) {
      onChange?.([])
    }
  }, [onChange, tableData, value])

  useEffect(() => {
    fetchTableData()
  }, [])

  return (
    <div className="flex flex-col">
      <SafeModalForm
        title="任务配置"
        onFinish={handleModalFormSubmit}
        schema={taskConfigSchema}
        scope={scope}
        trigger={
          <Space direction="vertical">
            <div>
              <Space>
                <Tooltip title={showTooltip ? (field.description ?? '') : ''} placement="bottom">
                  <Button type="default" icon={<ShareAltOutlined />} disabled={disabledAddTask}>
                    {buttonName || '配置'}
                  </Button>
                </Tooltip>
              </Space>
            </div>
          </Space>
        }
      />
      <div className="w-full">
        <DragTable
          dataSource={tableData}
          size="small"
          rowKey="activity_task_id"
          setDataSource={setTableData}
          toolBarRender={false}
          columns={columns}
          pagination={false}
          search={false}
        />
      </div>
    </div>
  )
})
