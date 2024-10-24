/**
 * 活动模板创建或编辑组件
 *
 * 该组件用于创建新的抽奖活动或编辑现有活动。
 * 它包含多个部分，如基本信息、背景样式、抽奖奖品配置等。
 * 组件会根据路由参数判断是创建、编辑还是复制模式。
 */
import {
  createActivity,
  getActivityDetail,
  saveLotteryRegion,
  unlockActivity,
  updateActivity,
  type CreateActivityParams,
  type GetActivityDetail,
} from '@/api/admin'
import { saveTaskRegion } from '@/api/admin/activity/task'
import { LotteryTemplateSection, type LotteryTemplateSectionType } from '@/constant/schema/lottery-activity/lotteryTemplateSection'
import { useGuildData } from '@/contexts/GuildDataContext'
import { useLotteryActivityId } from '@/contexts/LotteryActivityIdContext'
import { useLotteryActivityData } from '@/contexts/LotteryActivityIdDataContext'
import useFormilyForm from '@/hooks/useFormilyForm'
import { useResponsiveIframeViewer } from '@/hooks/useResponsiveIframeViewer'
import { copy } from '@/utils/common-func'
import { getGuildId } from '@/utils/storage'
import { previewActivityUrl, previewEncryptActivityUrl } from '@/utils/url'
import { EyeOutlined } from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { onFieldValueChange, type Form } from '@formily/core'
import { FormProvider } from '@formily/react'
import { toJS } from '@formily/reactive'
import { Button, Popconfirm, Space, Tag, Tooltip, message } from 'antd'
import { omit, pick } from 'es-toolkit'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { SchemaFields } from './SchemaFields'
import { SectionCard } from './SectionCard'

/**
 * 活动模板创建或编辑主组件
 */
function ActivityTemplateCreateOrEdit() {
  const navigate = useNavigate()
  // 保存当前的活动 ID，编辑态或者创建的时候非基础信息板块会用到这个 id
  const { activityId, setActivityId } = useLotteryActivityId()
  const { setActivityData } = useLotteryActivityData()
  const { openDrawer: responsiveIframeViewer } = useResponsiveIframeViewer()

  /**
   * 创建表单属性
   * 包含表单效果定义，如字段值变化时的联动效果
   */
  const createFormProps = useMemo(
    () => ({
      initialValues: {
        template_type: 'squared_paper', // 默认为九宫格
        draw_num: 8, // 默认奖品个数为8
      },
      effects() {
        onFieldValueChange('*.template_type', (field, form) => {
          form.setFieldState('LotteryPrizeConf.draw_num', state => {
            if (field.value === 'squared_paper') {
              // 九宫格模式，只允许选择 8
              state.dataSource = [{ label: '8', value: 8 }]
              if (!state.value) {
                state.value = 8
              }
            } else if (field.value === 'the_big_wheel') {
              // 大转盘模式，允许选择 4, 6, 8, 10
              state.dataSource = [
                { label: '4', value: 4 },
                { label: '6', value: 6 },
                { label: '8', value: 8 },
                { label: '10', value: 10 },
              ]
              if (!state.value) {
                state.value = 4
              }
            }
          })
        })

        // 监听奖品个数变化，更新奖品详情字段
        onFieldValueChange('draw_num', (field, form) => {
          console.log('%c 奖品个数变更:', 'color:#f5ce50', field.value)
          form.setFieldState('prizeDetail', state => {
            // 这里可以根据奖品个数更新奖品详情字段的验证规则或其他属性
            // 例如：
            state.required = true
            state.description = `请添加${field.value}个奖品`
          })
        })
      },
    }),
    []
  )

  const { fetchGuildData } = useGuildData()
  const location = useLocation()
  const { form, createSchemaFieldComponent } = useFormilyForm({ createFormProps })

  // 获取活动模板 id，进入编辑态
  const routeQuery = useParams<{ action: 'edit' | 'create' | 'copy'; activity_id: string }>()

  // 创建的时候 loading 默认不开启，编辑态的时候会以拉取详情接口为准
  const [initLoading, setInitLoading] = useState(false)

  // 这个 ref 用来判断表单是否初始化完成【编辑态有接口请求再初始化】
  const formEditInitializedRef = useRef(false)

  /**
   * 打开预览抽屉
   */
  const handleOpenPreviewDrawer = useCallback(() => {
    const currentActivityId = routeQuery?.activity_id ?? activityId
    if (currentActivityId) {
      responsiveIframeViewer(previewActivityUrl(currentActivityId), `活动ID: ${currentActivityId}`, {
        width: 650,
        onCopy: content => {
          if (typeof content === 'string') {
            const url = previewEncryptActivityUrl(currentActivityId)
            console.log('%c Line:32 🍏 url', 'color:#93c0a4', url)
            copy(url)
          }
        },
      })
    }
  }, [activityId, responsiveIframeViewer, routeQuery?.activity_id])

  /**
   * 处理表单提交
   * @param {LotteryTemplateSectionType} sectionKey - 提交的表单区域键
   */
  const handleSubmitForSection = useCallback(
    async (sectionKey: LotteryTemplateSectionType) => {
      try {
        if (form) {
          // 校验指定区域的所有字段
          // 先清空其他区域的校验的错误，再校验指定区域
          form.clearErrors('*')
          const fields = form.query(`${sectionKey}.*`).map(field => field)
          const visibleFields = fields.filter(field => field.visible).map(field => field.address)
          for (const address of visibleFields) {
            await form.validate(address)
          }

          // 获取指定区域的值
          const sectionFormValues = await form.getValuesIn(sectionKey)

          // 打印或处理获取到的值
          console.log(`Form values for ${sectionKey}:`, toJS(sectionFormValues))

          if (sectionKey === LotteryTemplateSection.BasicInfo.key) {
            // 基础信息板块
            const basicInfoSectionForm = omit(sectionFormValues, ['start_end_time'])
            const params = {
              ...basicInfoSectionForm,
              start_time: sectionFormValues?.start_end_time[0],
              end_time: sectionFormValues?.start_end_time[1],
            } as CreateActivityParams
            console.log('%c Line:157 🍏 params', 'color:#33a5ff', params)

            if ((routeQuery?.action === 'create' || routeQuery?.action === 'copy') && !activityId) {
              // 创建没有活动 ID
              // 创建活动的时候，如果是基础信息区域，则保存成功后，将其他区域置的 schema 渲染可见
              // 初始化其他 schema 是不可见的，基础信息是前置条件
              const res = await createActivity({ params })
              setActivityId(`${res.activity_id}`)
            } else {
              if (activityId) {
                console.log('%c Line:131 🍖 activityId', 'color:#4fff4B', activityId)
                await updateActivity({ activity_id: activityId, params })
              }
            }
            message.success(`${LotteryTemplateSection[sectionKey as keyof typeof LotteryTemplateSection].name} 板块保存成功`)
          }

          if (!activityId) return
          if (sectionKey === LotteryTemplateSection.MoreActivity.key) {
            // 更多活动板块
            const res = await updateActivity({ activity_id: activityId, params: sectionFormValues })
            console.log('%c Line:163 🍿 res', 'color:#b03734', res)
            message.success(`${LotteryTemplateSection[sectionKey as keyof typeof LotteryTemplateSection].name} 板块保存成功`)
          }
          if (sectionKey === LotteryTemplateSection.BgStyle.key) {
            // 背景图板块
            const res = await updateActivity({ activity_id: activityId, params: sectionFormValues })
            console.log('%c Line:168 🍿 res', 'color:#33a5ff', res)
            message.success(`${LotteryTemplateSection[sectionKey as keyof typeof LotteryTemplateSection].name} 板块保存成功`)
          }
          if (sectionKey === LotteryTemplateSection.LotteryPrizeConf.key) {
            // 抽奖配置保存
            const res = await saveLotteryRegion(activityId, sectionFormValues)
            console.log('%c Line:173 🍪 res', 'color:#465975', res)
            message.success(`${LotteryTemplateSection[sectionKey as keyof typeof LotteryTemplateSection].name} 板块保存成功`)
          }
          if (sectionKey === LotteryTemplateSection.TaskInfo.key) {
            // 任务配置保存
            const res = await saveTaskRegion({
              activity_id: Number(activityId),
              ...sectionFormValues,
            })
            message.success(`${LotteryTemplateSection[sectionKey as keyof typeof LotteryTemplateSection].name} 板块保存成功`)
            console.log('%c Line:145 🍯 res', 'color:#465975', res)
          }
        }
      } catch (error: any) {
        console.log('%c Line:159 🥛 error', 'color:#465975', error)
        if (Array.isArray(error) && error.length > 0) {
          // message.error(`${error[0].messages[0]}`)
        } else {
          message.error(`${LotteryTemplateSection[sectionKey as keyof typeof LotteryTemplateSection].name} 表单提交失败，请检查输入`)
        }
      }
    },
    [activityId, form, routeQuery?.action, setActivityId]
  )

  /**
   * 初始化编辑表单
   * @param {Form} form - Formily 表单实例
   * @param {GetActivityDetail} data - 活动详情数据
   */
  const formEditInit = useCallback((form: Form, data: GetActivityDetail) => {
    if (data.online_at) {
      // 禁用日期选择：开始时间
      form.setFieldState('BasicInfo.date', state => {
        state.componentProps = state.componentProps || {}
        state.componentProps.disabled = [true, false]
      })

      // 回填:基础信息回填- 抽奖样式
      form.setFieldState('BasicInfo.template_type', state => {
        state.disabled = true
      })

      //回填:基础信息回填- 日期
      form.setFieldState('BasicInfo.start_end_time', state => {
        state.componentProps!.disabled = [true, false]
      })
    }

    // 回填:基础信息
    const basicInfo = {
      [LotteryTemplateSection.BasicInfo.key]: {
        ...pick(data, ['template_type', 'name', 'rule', 'priority', 'share_data']),
        start_end_time: [data.start_time, data.end_time],
      },
    }
    // 回填: 背景图区
    const bgStyle = {
      [LotteryTemplateSection.BgStyle.key]: {
        ...pick(data, ['header_img', 'bg_img_color']),
      },
    }

    // 回填:更多活动
    const moreActivity = {
      [LotteryTemplateSection.MoreActivity.key]: {
        ...pick(data, ['more_activity', 'more_title']),
      },
    }

    // 回填: 抽奖配置
    const lotteryPrizeConf = {
      [LotteryTemplateSection.LotteryPrizeConf.key]: {
        ...pick(data, ['draw_button_img', 'draw_img', 'draw_num']),
      },
    }

    // 回填: 任务配置
    const taskInfo = {
      [LotteryTemplateSection.TaskInfo.key]: {
        ...pick(data, ['task_number']),
      },
    }

    form.setValues({
      ...basicInfo,
      ...moreActivity,
      ...bgStyle,
      ...lotteryPrizeConf,
      ...taskInfo,
    })
  }, [])

  /**
   * 处理取消操作
   * 离开创建流程，跳转到列表页面
   */
  const handleCancel = useCallback(async () => {
    navigate('/admin/lottery-activity/list', { replace: true })
  }, [navigate])

  const handleActivityStatusCheck = useCallback(
    (data: GetActivityDetail) => {
      if (data.status === 1) {
        message.error('该活动已上线，无法编辑。')
        navigate('/admin/lottery-activity/list', { replace: true })
        return false
      }
      return true
    },
    [navigate]
  )

  const enterEditLock = useCallback(async () => {
    setActivityId(routeQuery.activity_id)
    try {
      setInitLoading(true)
      const data = await getActivityDetail({ activity_id: routeQuery.activity_id! })
      setActivityData(data)
      if (!handleActivityStatusCheck(data)) {
        return
      }

      if (form) {
        formEditInit(form, data)
        formEditInitializedRef.current = true
      }
    } catch (error) {
      console.log('%c Line:252 🍔 error', 'color:#2eafb0', error)
      message.error('获取活动详情失败，请稍后重试。')
    } finally {
      setInitLoading(false)
    }
  }, [setActivityId, routeQuery.activity_id, setActivityData, handleActivityStatusCheck, form, formEditInit])

  useEffect(() => {
    const enterCopyLock = async () => {
      setInitLoading(true)
      const copyActivityId = location.state?.copyActivityId
      const data = await getActivityDetail({ activity_id: copyActivityId })
      if (form) {
        formEditInit(form, data)
        setTimeout(() => {
          setInitLoading(false)
        }, 300)
      }
    }

    if (routeQuery.action === 'edit') {
      enterEditLock()
    }

    if (routeQuery.action === 'copy') {
      enterCopyLock()
    }
  }, [form, routeQuery, location.state?.copyActivityId, formEditInit, enterEditLock])

  const title = useMemo(() => {
    if (routeQuery?.action === 'create') {
      return (
        <Space>
          <span>抽奖活动</span>
          <Tag color="green">创建</Tag>
          {activityId && <Tag>ID:{activityId}</Tag>}
        </Space>
      )
    }
    if (routeQuery?.action === 'edit') {
      return (
        <Space>
          <span>抽奖活动</span>
          <Tag color="blue">编辑</Tag>
          <Tag>ID:{activityId}</Tag>
        </Space>
      )
    }
    if (routeQuery?.action === 'copy') {
      return (
        <Space>
          <span>抽奖活动</span>
          <Tag color="orange">复制</Tag>
          {activityId && <Tag>ID:{activityId}</Tag>}
        </Space>
      )
    }
    return (
      <Space>
        <span>抽奖活动</span>
        <Tag color="green">创建</Tag>
      </Space>
    )
  }, [routeQuery?.action, activityId])

  useEffect(() => {
    /**
     * 获取公会数据
     * 使用 location.key 作为依赖项，确保只在路由变化时触发
     */

    if (location.key) {
      const guildId = getGuildId()
      if (guildId) {
        fetchGuildData(guildId)
      }
    }
  }, [fetchGuildData, location.key, location.pathname])

  useEffect(() => {
    return () => {
      if (routeQuery && routeQuery?.activity_id && routeQuery?.action === 'edit') {
        unlockActivity({ activity_id: routeQuery.activity_id })
      }
      setActivityId(undefined)
      setActivityData(undefined)
    }
  }, [])

  if (!form) return null

  return (
    <FormProvider form={form}>
      <ProCard
        title={title}
        bordered
        loading={initLoading}
        headerBordered
        style={{
          marginBlockStart: 8,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: 'calc(100vh - 114px)', // 假设顶部有48px的高度,根据实际情况调整
        }}
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden', // 防止body出现滚动条
        }}
        extra={
          <Space>
            {activityId && (
              <div className="flex items-center justify-center p-2">
                <Tooltip title="点击预览活动页">
                  <Button type="primary" icon={<EyeOutlined />} onClick={handleOpenPreviewDrawer}>
                    预览
                  </Button>
                </Tooltip>
              </div>
            )}
            <Popconfirm
              title={
                <div>
                  <div>谨慎操作!!</div>
                  <div>关闭该活动创建、复制、编辑并返回列表页面,</div>
                  <div>如果部分必要数据保存过，就会变为草稿。</div>
                </div>
              }
              onConfirm={handleCancel}
              okText="确定"
              cancelText="取消"
              placement="bottom"
            >
              <Button type="primary" danger>
                退出该流程
              </Button>
            </Popconfirm>
          </Space>
        }
      >
        <div className="flex flex-1 flex-col gap-y-2 overflow-y-auto">
          <SectionCard
            title={LotteryTemplateSection.BasicInfo.name}
            onSubmit={() => handleSubmitForSection(LotteryTemplateSection.BasicInfo.key)}
            needConfirm={!activityId}
            confirmTitle="该区域填写保存成功后才会初始化其他板块的配置"
          >
            <SchemaFields.BaseInfoSchemaField createSchemaFieldComponent={createSchemaFieldComponent} />
          </SectionCard>

          {activityId && (
            <>
              <SectionCard title={LotteryTemplateSection.BgStyle.name} onSubmit={() => handleSubmitForSection(LotteryTemplateSection.BgStyle.key)}>
                <SchemaFields.BgStyleSchemaField createSchemaFieldComponent={createSchemaFieldComponent} />
              </SectionCard>
              {/* <SectionCard
                title={LotteryTemplateSection.BindAccount.name}
                onSubmit={() => handleSubmitForSection(LotteryTemplateSection.BindAccount.key)}
              >
                <SchemaFields.BindAccountSchemaField createSchemaFieldComponent={createSchemaFieldComponent} />
              </SectionCard> */}
              <SectionCard
                title={LotteryTemplateSection.LotteryPrizeConf.name}
                onSubmit={() => handleSubmitForSection(LotteryTemplateSection.LotteryPrizeConf.key)}
              >
                <SchemaFields.LotteryPrizeConfSchemaField createSchemaFieldComponent={createSchemaFieldComponent} />
              </SectionCard>
              <SectionCard title={LotteryTemplateSection.TaskInfo.name} onSubmit={() => handleSubmitForSection(LotteryTemplateSection.TaskInfo.key)}>
                <SchemaFields.TaskInfoSchemaField createSchemaFieldComponent={createSchemaFieldComponent} />
              </SectionCard>

              <SectionCard
                title={LotteryTemplateSection.MoreActivity.name}
                onSubmit={() => handleSubmitForSection(LotteryTemplateSection.MoreActivity.key)}
              >
                <SchemaFields.MoreActivitySchemaField createSchemaFieldComponent={createSchemaFieldComponent} />
              </SectionCard>
            </>
          )}
        </div>
      </ProCard>
    </FormProvider>
  )
}

export default ActivityTemplateCreateOrEdit
