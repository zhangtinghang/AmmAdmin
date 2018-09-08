"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const noticeObj = Schema.noticeObj;

const resData = require('../../../global.config').resData;
const root = require('../../../global.config').root;
// 解析传递上来的数据，前端使用x-www-form-urlencoded
const qs = require("qs");

 /**
  * 基础增删改查声明
  */
 const getDtata = require('../../utils/operaAdmin').selectData;
 const addData = require('../../utils/operaAdmin').addData;
 const deleteData = require('../../utils/operaAdmin').deleteData;
 const modifyStatusData = require('../../utils/operaAdmin').modifyStatusData;
const updateData = require('../../utils/operaAdmin').updateData;



exports.addNoticeFun = function (req, res, next) {
    var req = qs.parse(req.body);
    let { title, startTime, endTime, content, status, category, isOpen } = req.dataObj;
    var user = req.user;
    user = mongoose.Types.ObjectId(user);
    let reqData = { user, title, startTime, endTime, content, status, isOpen, category }
    addData(res, reqData, noticeObj);
}


exports.getNoticeFun = function (req, res, next) {
    getDtata(req, res, noticeObj);
}

/**
 * 根据_id删除下载信息
 */

exports.delNoticeFun = function (req, res, next) {
    deleteData(req, res, noticeObj);
}

/**
 * 修改下载信息状态
 */
exports.modNoticeFun = function (req, res, next) {
    modifyStatusData(req, res, noticeObj);
}

/**
 * 修改下载信息内容
 */
exports.updNoticeFun = function(req, res, next){
    updateData(req, res, noticeObj);
}