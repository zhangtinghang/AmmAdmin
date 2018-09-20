"use strict"
const Schema = require('../../../Schema/Schema');
const userObj = Schema.userObj;
const mongoose = require('mongoose');
const updateData = require('../../utils/operation').updateData;
const resData = require('../../../global.config').resData;
const typeCode = require('../../../typeCode');
const qs = require('qs');
/**
 * 修改账号数据
 */
exports.updateAccount = function(req, res, next){
    updateData(req, res, userObj);
}
exports.modifyPwd = function(req, res, next){
    //验证账号合法性
    let request = qs.parse(req.body);
    let oldPwd = request.dataObj.oldPwd;
    let newPwd = request.dataObj.newPwd;
    let user = request._id;
    let _id = mongoose.Types.ObjectId(user);
    userObj.findById(_id, function (err, result) {
        if (err || result.password != oldPwd) {
            return resData(res, typeCode.CONSUMER, false, '请检查密码是否正确');
        }
        //修改数据
        request.dataObj = {
            password: newPwd
        }
        req.body = request;
        updateData(req, res, userObj);
    })
}