//1. 导入express模块
const express = require('express')

//2. 创建express服务器实例
const server = express()
server.use((req, res, next) => {
    //status = 200 success
    //status = 201 failure
    res.cc = function (err, status = 1) {
        res.send({
            status: status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

//导入cors中间件
const cors = require('cors')
const config = require('./config')

//导入token中间件
const expressJWT = require('express-jwt')

//注册token中间件，所有以/api开头的路由都不需要验证token的正确性
server.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

//注册cors中间件
server.use(cors())

//引入验证规则模块
const joi = require('joi')

//注册异常捕获中间件
server.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    //认证异常捕捉
    if (err.name === 'UnauthorizedError') return res.cc('认证失败')

    //未知错误
    return res.cc(err)
})

//解析application/x-www-form-urlencoded
server.use(express.urlencoded({ extended: false }))

//导入用户路由
const authRouter = require('./router/auth')
//注册用户路由
server.use('/api/auth', authRouter)

const myRouter = require('./router/my')
server.use('/my', myRouter)


//3. 监听服务器80端口
server.listen(80, () => {
    console.log('Express server running on http://127.0.0.1:80')
})


