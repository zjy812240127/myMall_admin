import request from '@/utils/request'

const addr = 'http://127.0.0.1:88/api'

export default {


    // 更新品牌信息
    updateCategory(data) { // 要填入传到后端的参数
        return request({
            url: `${addr}/product/brand/update`,
            method: 'post', // 要和后端方法的请求方式一致
            data: data
        })
    },














}