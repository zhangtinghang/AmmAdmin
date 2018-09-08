"use strict"
const mongoose = require('mongoose');
const Schema = require('../../../Schema/Schema');
const blogObj = Schema.blogObj;

const getDtata = require('../../utils/operaAdmin').selectData;
const addData =  require('../../utils/operaAdmin').addData;
const deleteData = require('../../utils/operaAdmin').deleteData;
const modifyStatusData = require('../../utils/operaAdmin').modifyStatusData;

/**
 * 新增博文
 */
exports.blogAddFun = function (req, res, next) {
    if(!req.body instanceof Object){
        req.body = JSON.parse(req.body);
    }
    let { user, title, intro, category, blog, isOpen } = req.body;

    user = mongoose.Types.ObjectId(user);
    let reqData = {user, title, intro, category, blog, isOpen };
    addData(res, reqData, blogObj);
}

/**
 * 查询博文
 */
exports.getBlogFun = function (req, res, next) {
    getDtata(req, res, blogObj);
}

/**
 * 根据_id删除博文
 */
exports.blogDelFun = function (req, res, next) {
    deleteData(req, res, blogObj);
}

/**
 * 修改博文状态
 */
exports.blogModifyFun = function (req, res, next) {
    modifyStatusData(req, res, blogObj);
}