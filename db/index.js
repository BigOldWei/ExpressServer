// db/index.js

//导入mysql模块
const mysql = require('mysql')

//创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',  //数据库服务器地址，我们使用本机
    user: 'root',       //mysql用户名，替换为你的用户名
    password: '000000', //mysql密码，替换为你的密码
    database: 'db_node',//数据库名称，此处为db_node
})

//导出数据库连接对象
module.exports = db 