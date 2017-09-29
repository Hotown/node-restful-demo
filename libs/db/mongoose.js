const mongoose = require('mongoose');

const libs = process.cwd() + '/libs/';

const log = require(libs + 'log')(module);

const config = require(libs + 'config');

mongoose.connect(config.get('mongoose:uri'));


// 创建数据库连接
const db = mongoose.connection;

// 检测数据库是否错误
db.on('error', function (err) {
  log.error('Connection error:', err.message);
});

// 打开一次
db.once('open', function callback() {
  log.info("Connected to DB!");
});

module.exports = mongoose;