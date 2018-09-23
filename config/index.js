var path = require('path');
// 通过NODE_ENV来设置环境变量，如果没有指定则默认为生产环境
var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
// 载入配置文件
var file = path.resolve(__dirname, env);
try {
  module.exports = require(file);
} catch (err) {
  throw err;
}