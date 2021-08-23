'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    OPEN_PROXY: false, // 是否开启代理, 重置后需重启vue-cli
    BASE_API: '"http://127.0.0.1:88"' // 后端网关
})