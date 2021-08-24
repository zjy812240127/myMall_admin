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

    // 修改操作时根据id查询最新信息
    getById(catId) {
        return request({
            url: `${addr}/product/category/info/${catId}`,
            method: 'get' // 要和后端方法的请求方式一致
        })
    },



    // 修改菜单
    updateCategory(data) { // 要填入传到后端的参数
        return request({
            url: `${addr}/product/category/update`,
            method: 'post', // 要和后端方法的请求方式一致
            data: data
        })
    },





    uploadActivity(activity) { // 要填入传到后端的参数
        return request({
            url: `/eduservice/activity/addActivity`,
            method: 'post', // 要和后端方法的请求方式一致
            data: activity
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









}