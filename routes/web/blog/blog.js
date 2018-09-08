"use strict"
const Schema = require('../../../Schema/Schema');
const blogObj = Schema.blogObj;
const getDtata = require('../../utils/operation').selectData;

/**
 * 查询
 * 1.检索所有数据
 * 2.根据类型检索
 * 3.检索公开/私密数据
 * 若为游客，只能检索公开数据
 * 若为用户，检索所有公开和私密数据
 */

exports.getBlogFun = function (req, res, next) {
    getDtata(req, res, blogObj);
}
