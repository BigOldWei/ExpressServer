//router/auth.js

const express = require('express')

//创建路由对象
const router = express.Router()

//引入验证中间件
const expressJoi = require('@escook/express-joi')

//引入验证规则
const { reg_login_schema } = require('../schema/auth')

//引入auth处理模块
const authHandler = require('../router_handler/auth')

//用户注册路由，添加验证中间件
router.post('/register', expressJoi(reg_login_schema), authHandler.authRegister)

//用户登录路由
router.post('/login', expressJoi(reg_login_schema), authHandler.authLogin)

//共享router对象
module.exports = router