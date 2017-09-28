const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const methodOverride = require("method-override");

const libs = process.cwd() + "/libs";
require(libs + "auth/auth");

const config = require("./config");
const log = require("./log")(module);

const api = require("./routes/api");
const users = require("./routes/users");
const articles = require("./routes/articles");

const app = express();

// 加载中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

// 路由绑定
app.use('/', api);
app.use('/api', api);
app.use('/api/users', users);
app.use('/api/articles', articles);
app.use('/api/oauth/token', oauth2.token);

// 定义页面错误处理
app.use(function (req, res, next) {
    res.status(404);
    log.debug("%s %d %s", req.method, res.statusCode, err.message);
    res.json({
        error: "404 Not Found"
    });
    return;
});

// 定义全局错误处理
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error("%s %d %s", req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});

module.exports = app;