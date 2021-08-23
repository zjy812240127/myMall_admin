import request from '@/utils/request'

const addr = 'http://127.0.0.1:88/api'

export default {


    // 批量删除
    deleteByIdList(idList) {
        return request({
            url: `${addr}/product/category/delete`,
            method: 'post', // 要和后端方法的请求方式一致
            data: idList
        })
    },

    insertCategory(category) {
        return request({
            url: `${addr}/product/category/save`,
            method: 'post', // 要和后端方法的请求方式一致
            data: category
        })
    },

    // 分页条件查询
    getActivityList(current, limit, activity) {
        return request({
            url: `/eduservice/activity/getByConditions/${current}/${limit}`,
            method: 'post', // 要和后端方法的请求方式一致
            data: activity
        })
    },

    // 修改操作时根据id查询活动信息
    getById(id) {
        return request({
            url: `/eduservice/activity/selectById/${id}`,
            method: 'get' // 要和后端方法的请求方式一致
        })
    },

    uploadActivity(activity) { // 要填入传到后端的参数
        return request({
            url: `/eduservice/activity/addActivity`,
            method: 'post', // 要和后端方法的请求方式一致
            data: activity
        })
    },

    updateActivityById(activity) { // 要填入传到后端的参数
        return request({
            url: `/eduservice/activity/alterActivity`,
            method: 'post', // 要和后端方法的请求方式一致
            data: activity
        })
    },



}