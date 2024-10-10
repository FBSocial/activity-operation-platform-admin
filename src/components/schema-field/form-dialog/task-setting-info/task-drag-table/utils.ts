import { MarketingStrategy } from "@/constant/schema/lottery-activity/task";

export const getAction = (formData, typeSetting) => {
    console.log("%c Line:2 🍢 formData", "color:#2eafb0", formData);
    console.log("%c Line:2 🍷 typeSetting", "color:#465975", typeSetting);
    return {
        taskType: '',
        params: {
            activity_id: formData?.activityId,
        },
    }
}


export const getTaskEventValue = (formData, typeSetting) => {
    console.log("%c Line:8 🍢 formData", "color:#2eafb0", formData);
    console.log("%c Line:8 🍷 typeSetting", "color:#465975", typeSetting);
    let task_event = ''
    // 如果选择了分享拉新的分类
    if (formData.taskSettingType === MarketingStrategy.ShareAndAcquire.value) {
        // 如果是每日分享活动
        if (formData.task === 'task_fb_actvity_share') {
            task_event = 'task_fb_actvity_share'
        }
        // 如果是邀请好友
        if (formData.task === 'task_fb_invite_join') {
            task_event = formData.task
        }
    } else {
        task_event = formData.task
    }

    return task_event

}