# Node-RSETful

以Express.js为主体框架，MongoDB为数据库，整合OAuth2orize和Passport.js，完成了一个简单的OAuth2.0授权登录系统。

目的在于学习使用Node.js搭建REST API。源码参考自[Node REST API](https://github.com/ealeksandrov/NodeAPI)。

## How to use

确保环境中安装了 `Node.js` 和 `MongoDB`。

### 安装依赖

	npm install

### 创建demo数据

	node generateData.js
	
### 启动服务

	node bin/www
	
### 使用

生成`access_token`和`refresh_token`

```
http POST http://localhost:3000/api/oauth/token grant_type=password client_id=hotown client_secret=123456 username=hotown password=123456
```

用`refresh_token`更新`access_token`

```
http POST http://localhost:3000/api/oauth/token grant_type=refresh_token client_id=hotown client_secret=123456 refresh_token=[REFRESH_TOKEN]
```

创建article，模拟授权以后的行为

```
http POST http://localhost:1337/api/articles title=Test author='Hotown' description='This is a test article.' images:='[]' Authorization:'Bearer PUT_YOUR_TOKEN_HERE'
```

还有更新，删除，获取文章的操作，这里不再赘述

## Modules used

几个重要的模块

+ express
+ mongoose
+ nconf
+ winston
+ faker
+ oauth2orize
+ passport

## License

MIT
