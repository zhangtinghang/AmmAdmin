"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const resData = require('../../../global.config').resData;
const userObj = Schema.userObj;


const getDtata = require('../../utils/operaAdmin').selectData;
const addData =  require('../../utils/operaAdmin').addData;
const deleteData = require('../../utils/operaAdmin').deleteData;
const modifyStatusData = require('../../utils/operaAdmin').modifyStatusData;
const updateData = require('../../utils/operaAdmin').updateData;
/**
 * 修改账号数据
 */
exports.updateAccount = function(req, res, next){
    updateData(req, res, userObj);
}
/**
 * 检索账号数据
 */
exports.findAccount = function(req, res, next){
    
}

 /**
 * 修改账号状态
 */
exports.changeAccStatus = function(req, res, next){
    modifyStatusData(req, res, userObj);
}

 /**
 * 根据_id删除账号
 */
exports.delAccount = function (req, res, next) {
    deleteData(req, res, userObj);
}

/**
 * 获取用户列表
 */
exports.getUserList = function(req, res, next){
    getDtata(req, res, userObj);
    // return resData(res, typeCode.CONSUMER, false, typeCode.UESER_GET_ERR);

}