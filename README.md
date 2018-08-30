# 基于node.js+mongodb+express的服务器系统

> 这是一个简单的基于node.js的服务器端，内部使用。

项目框架：
[express](https://github.com/PanJiaChen/vue-admin-template)
[mongoose]()


## 相关项目
[后台管理系统地址](https://github.com/zhangtinghang/AmmManageent)

[前端展示地址](https://github.com/zhangtinghang/Amm)

## 开发

```bash
# 克隆项目
git clone git@github.com:zhangtinghang/AmmAdmin.git

# 安装依赖
npm install

# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run start
```

## 文件目录


  - bin   - - - express配置启动服务

  - dbheper    - - - 对mongoose查询数据的简单封装

  - dbsql   - - - 对每个模型的方法简单封装

  - middleware  - - - token生成验证库

  - public  - - - 图片，js库等开放资源

  - routers - - - 路由管理

  - Schma - - - 模型初始化

  - views  - - - 错误页面等处理页面

  - app.js   - - - 函数执行入口文件

  - db.config.js  - - - 数据库的配置文件

  - global.config.js  - - - 部分公共方法

  - typeCode.js  - - - 状态返回定义文件



