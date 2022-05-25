![f4dc19951fd96a3a09db08f6cfd5fedc](http://img.weidawang.site/i/2022/05/24/628cecd21e3d9.jpeg)

<div align='center'>
<h1>Node.js入门</h1>
</div>

# 初始化

## 1.创建项目

1. 创建项目文件夹，并再项目根目录初始化`npm`包管理文件，以`ExpressServer`为例，代码如下：

```bash
mkdir ExpressServer && cd ExpressServer
npm init -y
```

2. 运行如下命令安装`express`：

```bash
npm i express
```

3. 创建项目入口文件，并初始化内容如下：

```javascript
//1. 导入express模块
const express = require('express')

//2. 创建express服务器实例
const server = express()

// TODO:在这里编写服务器代码

//3. 监听服务器80端口
server.listen(80, () => {
    console.log('Express server running on http://127.0.0.1:80')
})
```

## 2.配置cors跨域

1. 运行如下命令安装`cors`中间件：

```bash
npm i cors
```

2. 在`app.js`中导入并配置`cors`中间件：

```js
//1. 导入cors中间件
const cors = require('cors')
//2. 注册cors中间件
server.use(cors())
```

## 3.配置表单数据解析中间件

1. 配置如下代码，解析`application/x-www-form-urlencoded`格式的表单数据：

```javascript
server.use(express.urlencoded({ extended: false }))
```

## 4.初始化路由文件夹

1. 项目根目录中，创建`router`文件夹，用于存放所有的路由模块
2. 项目根目录中，创建`router_handler`文件夹，用于存放所有的路由处理模块

```bash
mkdir router 
mkdir router_handler
```

## 5.初始化路由模块

1. 在`router`文件夹中新建`auth.js`，用于存储所有的用户路由，编写内容如下：

```js
const express = require('express')

//创建路由对象
const router = express.Router()


//用户注册路由
router.post('/register', (req, res) => {
    res.send('POST /register')
})

//用户登录路由
router.post('/login', (req, res) => {
    res.send('POST /login')
})

//共享router对象
module.exports = router
```

2. 在`app.js`中，导入并注册用户路由模块：

```js
//导入用户路由
const authRouter = require('./router/auth')
//注册用户路由
server.use('/api/auth',authRouter)
```

## 6.启动并测试服务器

1. 安装`nodemon`模块，用于启动服务器（`nodemon`模块可以在我们修改代码后自动重启服务器）：

```bash
npm i -g nodemon
```

2. 使用`nodemon`模块启动服务器：

```bash
nodemon app.js
```

如果操作正确，服务器正常启动，将输出如下内容：

```bash
PS E:\ExpressServer> nodemon .\app.js
[nodemon] 2.0.16
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node .\app.js`
Express server running on http://127.0.0.1:80
```

3. 使用`postman`测试接口是否配置正确，以`POST`方式分别访问`localhost/api/auth/register`和`localhost/api/auth/login`

![image-20220524160923824](http://img.weidawang.site/i/2022/05/24/628c94070e4bb.png)

![image-20220524161021302](http://img.weidawang.site/i/2022/05/24/628c940b4a316.png)

## 7.抽离路由处理函数

> 为了保证路由模块的存粹性，将路由处理函数单独抽离出来放在`router_handler`文件夹中

1. 在`router_handler`文件夹中创建并编辑`auth.js`文件如下：

```js
//router_handler/auth.js

//注册处理函数
exports.authRegister = (req, res) => {
    res.send('POST /register')
}

//登录处理函数
exports.authLogin = (req, res) => {
    res.send('POST /login')
}
```

2. 修改`/router/auth.js`文件代码如下：

```js
//router/auth.js

const express = require('express')

//创建路由对象
const router = express.Router()

//引入auth处理模块
const authHandler = require('../router_handler/auth')

//用户注册路由
router.post('/register', authHandler.authRegister)

//用户登录路由
router.post('/login', authHandler.authLogin)

//共享router对象
module.exports = router
```

3. 使用`nodemon`启动并使用`postman`访问`localhost/api/auth/register`和`localhost/api/auth/login`，会得到和之前（`6.3`）相同的结果。

# 注册

## 1.创建数据库

1. 创建`MySql`数据库，此处以`db_node`为例:

```sql
CREATE SCHEMA `db_node` ;
```

> 如果还没有安装MySql，可以在这里下载[MySql安装器]()

2. 创建`t_users`数据表，创建表`sql`指令如下:

```sql
CREATE TABLE `db_node`.`t_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `avatar` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
```

## 2.安装并配置mysql模块

1. 执行如下指令，安装`mysql`模块：

```bash
npm i mysql
```

2. 创建`/db/index.js`文件，此文件用于存储数据库连接对象：

```js
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
```

## 3.注册

1. 注册步骤

- 检测表单数据
- 检测用户名是否占用
- 密码加密处理
- 插入新用户

2. 检测表单数据

```js
const userinfo = req.body
    if(!userinfo.username || !userinfo.password){
        return res.send({
            status: 201,
            message:'用户名、密码不能为空！'
        })
    }
```

3. 检测用户名是否占用

- 从`db/index.js`导入`db`

```js
const db = require('../db/index')
```

- 定义`SQL`

```js
sqlStr = 'select * from t_users where username = ?'
```

- 执行`SQL`语句，判断是否占用：

```js
db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.send({ status: 201, message: err.message })
        if(results.length > 0){
            return res.send({status:201,message:'用户名已存在'})
        }
        //TODO:插入新用户
    })
```

4. 密码加密

- 执行以下指令，安装`bcryptjs`模块

```bash
npm i bcryptjs
```

- 在`router_handler/auth.js`中，导入`bcryptjs`

```js
const bcrypt = require('bcryptjs')
```

- 插入用户之前，使用`bcrypt.hashSync(password，len)`进行加密

```js
userinfo.password = bcrypt.hashSync(userinfo.password,10)
```

5. 插入用户

- 定义`SQL`

```js
sqlStr = 'insert into t_users set ?'
```

- 执行`SQL`，插入用户

```js
db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.send({ status: 201, message: err.message })
            if (results.affectedRows === 1)
                return res.send({ status: 200, message: 'success' })
            return res.send({ status: 201, message: '注册失败，稍后再试' })
        })
```

## 4.注册测试

1. 使用`PostMan`发送注册信息，操作如下：

![image-20220524200637067](http://img.weidawang.site/i/2022/05/24/628ccaca6dd99.png)

2. 我们可以查看数据库：

![image-20220524200805065](http://img.weidawang.site/i/2022/05/24/628ccb226a404.png)

如此，注册方法变成功执行了。

# 优化res.send()

> 我们在代码中多次使用到了`res.send()`方法，非常繁琐，需要封装简化代码。（不优化也没啥）

1. 在`app.js`中所有的路由之前定义并注册全局中间件

```js
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

```

这样在所有的路由中，`res`都具有一个`cc`方法，可以方便的向客户端输出结果。

# 优化表单验证

> 表单验证，前端为辅，后端为主，永远不相信前端提交的数据

## 1.安装包

1.安装`joi`包，为表单项定义验证规则

```bash
npm i joi
```

2. 安装`@escook/express-joi`，实现自动验证表单数据

```bash
npm i @escook/express-joi
```

## 2.验证规则

1. 新建`schema/auth.js`用户验证规则模块

```bash
mkdir schema
touch schema/auth.js
```

2. 初始化如下：

```js
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
```

## 4.插入验证中间件

1. 引入验证中间件

```js
//引入验证中间件
const expressJoi = require('@escook/express-joi') //(*)
```

2. 引入验证规则

```js
//引入验证规则
const { reg_login_schema } = require('../schema/auth')//(*)
```

3. 注册验证中间件

```js
//用户注册路由，添加验证中间件
router.post('/register', expressJoi(reg_login_schema), authHandler.authRegister) //(*)
```

修改后的`route/auth.js`，如下：

```js
//router/auth.js

const express = require('express')

//创建路由对象
const router = express.Router()

//引入验证中间件
const expressJoi = require('@escook/express-joi') //(*)

//引入验证规则
const { reg_login_schema } = require('../schema/auth')//(*)

//引入auth处理模块
const authHandler = require('../router_handler/auth')

//用户注册路由，添加验证中间件
router.post('/register', expressJoi(reg_login_schema), authHandler.authRegister) //(*)

//用户登录路由
router.post('/login', authHandler.authLogin)

//共享router对象
module.exports = router
```

注意以上代码中`(*)`处是修改的地方。

## 5.捕获验证错误

在`app.js`中创建并注册全局错误处理中间件，用于处理验证错误（也可以处理其他错误）。

1. 引入验证规则

```js
//引入验证规则模块
const joi = require('joi')
```

2. 创建并注册全局异常中间件

```js
//引入验证规则模块
const joi = require('joi')

//注册异常捕获中间件
server.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.cc(err)
    res.cc(err)
})
```

## 6.验证测试

![image-20220524205441247](http://img.weidawang.site/i/2022/05/24/628cd60eaf3a5.png)

# 登录

## 1.登录步骤

1. 表单验证；
2. 数据查询；
3. 密码比较；
4. 生成`JWT`的`Token`字符串

## 2.表单验证

1. 修改`router/auth.js`的路由如下：

```js
//用户登录路由
router.post('/login', expressJoi(reg_login_schema), authHandler.authLogin)
```

## 3.数据查询

在`router_handler/auth.js`中的登录处理方法中：

1. 表单数据接收

```js
const userinfo = req.body
```

2. 定义`SQL`语句

```js
const sqlStr = 'select * from t_users where username=?'
```

3. 执行查询`SQL`

```js
//执行查询
db.query(sqlStr, userinfo.username, (err, results) => {
    //查询失败
    if (err) return res.cc(err)
    //查询结果不合理
    if (results.length !== 1) return res.cc("登录失败")
    //TODO:判断密码
})
```

## 4.密码比较

> 调用`bcrypt.compreSync(表单密码，数据库密码)`判断密码是否一致，`true`一致，`false`不一致

```js
//判断密码
const cmpRes = bcrypt.compare(userinfo.password, results[0].password)
if (!cmpRes) return res.cc('Login Failed')

//TODO:登录成功，生成token
```

## 5.生成token

1. 从查询结果中剔除`password`和`avatar`两个值

```js
const usr = { ...results[0], password: '', avatar: '' }
```

2. 安装`jwt`

```bash
npm i jsonwebtoken
```

3. 在`router_handler/auth.js`中导入`jwt`

```js
const jwt = require('jsonwebtoken')
```

4. 根目录创建配置文件`config.js`，并共享`jwtSecretKey`字符串（用于加密）

```js
//config.js
module.exports = {
    //一个复杂字符串
    jwtSecretKey: "alkjflasngaoieakgbnasdfzxfgasdf",
    expiresIn: '24h',//token有效期24h
}
```

5. 加密用户信息，生成`token`

```js
//导入config
const config = require('../config')

//生成token
const tokenStr = jwt.sign(usr, config.jwtSecretKey, {
            expiresIn: config.expiresIn,//token有效期为24小时
})
```

6. 返回客户端

```js
res.send({
    status: 200,
    message: 'login success',
    token: 'Bearer ' + tokenStr
})
```

7. 测试登录

![image-20220524214849181](http://img.weidawang.site/i/2022/05/24/628ce2beb84ca.png)

## 6.Token解析

1. 安装`express-jwt`模块（注意版本，较新版本不适合本教程）

```bash
npm i express-jwt@5.3.3
```

2. `app.js`中注册路由之前配置`Token`中间件

```js
const config = require('./config')

//导入token中间件
const expressJWT = require('express-jwt')

//注册token中间件，所有以/api开头的路由都需要验证token的正确性
server.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))
```

3. `app.js`中`token`认证失败异常捕捉

```js
if (err.name === 'UnauthorizedError') return res.cc('认证失败')
```

4. 解析验证

访问非`/api`开头的路由即可，这里使用`/my`

![image-20220524222320204](http://img.weidawang.site/i/2022/05/24/628cead5ceffe.png)

想要验证成功，需要在`Header`中加入`Authorization`字段，字段的值是登录时返回的`Token`：

![image-20220524222446883](http://img.weidawang.site/i/2022/05/24/628ceb2c7aa06.png)





















