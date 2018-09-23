"use strict"
const Schema = require('../../../Schema/Schema');
const userObj = Schema.userObj;
const mongoose = require('mongoose');
const updateData = require('../../utils/operation').updateData;
const resData = require('../../../global.config').resData;
const typeCode = require('../../../typeCode');
const crypto = require("crypto");
/**
 * 修改账号数据
 */
exports.updateAccount = function(req, res, next){
    req.body.updateObj = {
        type:req.body.type
    };
    updateData(req, res, userObj);
}

exports.modifyPwd = function(req, res, next){
    //验证账号合法性
    let { oldPwd, newPwd, confirmPwd } = req.body;
    oldPwd = crypto.createHmac('sha1', JSON.stringify(oldPwd)).digest('base64');
    newPwd = crypto.createHmac('sha1', JSON.stringify(newPwd)).digest('base64');
    let { id } = req.payload;
    let _id = mongoose.Types.ObjectId(id);
    userObj.findById(_id, function (err, result) {
        console.log(err, result)
        if (err || result.password != oldPwd) {
            return resData(res, typeCode.CONSUMER, false, '请检查密码是否正确');
        }
        //修改数据
        req.body.updateObj = {
            password: newPwd
        }
        updateData(req, res, userObj);
    })
}