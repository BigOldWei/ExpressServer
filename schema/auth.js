//schema/auth.js
//导入包
const joi = require('joi')
/**
 * string() 字符串
 * alphanum() 字符数字串
 * min(len) 最短
 * max(len) 最长
 * required() 不为空
 * pattern(reg) 符合正则
 */

//用户名密码验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

//登录注册验证对象
exports.reg_login_schema = {
    body: {
        username,
        password
    }
}