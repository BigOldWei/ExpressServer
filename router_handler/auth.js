//router_handler/auth.js

const db = require('../db/index')
const bcrypt = require('bcryptjs')
const config = require('../config')
const jwt = require('jsonwebtoken')

//注册处理函数
exports.authRegister = (req, res) => {
    console.log('POST /register')
    const userinfo = req.body
    //引入joi验证后，就不再需要这里验证了
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({
    //         status: 201,
    //         message: '用户名、密码不能为空！'
    //     })
    // }
    sqlStr = 'select * from t_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.send({ status: 201, message: err.message })
        if (results.length > 0) {
            return res.send({ status: 201, message: '用户名已存在' })
        }
        //TODO:插入新用户
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        sqlStr = 'insert into t_users set ?'
        db.query(sqlStr, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.send({ status: 201, message: err.message })
            if (results.affectedRows === 1)
                return res.send({ status: 200, message: 'success' })
            return res.send({ status: 201, message: '注册失败，稍后再试' })
        })

    })

}


//登录处理函数
exports.authLogin = (req, res) => {
    const userinfo = req.body
    const sqlStr = 'select * from t_users where username=?'

    //执行查询
    db.query(sqlStr, userinfo.username, (err, results) => {
        //查询失败
        if (err) return res.cc(err)

        //查询结果不合理
        if (results.length !== 1) return res.cc("登录失败")

        //判断密码
        const cmpRes = bcrypt.compare(userinfo.password, results[0].password)
        if (!cmpRes) return res.cc('Login Failed')

        //登录成功，生成token
        const usr = { ...results[0], password: '', avatar: '' }
        const tokenStr = jwt.sign(usr, config.jwtSecretKey, {
            expiresIn: config.expiresIn,//token有效期为24小时
        })
        return res.send({
            status: 200,
            message: 'login success',
            token: 'Bearer ' + tokenStr
        })
    })
}