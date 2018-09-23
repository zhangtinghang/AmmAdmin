
"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const touristObj = Schema.touristObj;
const userObj = Schema.userObj;
const crypto = require("crypto");
//操作数据库
const userDB = require('../../../dbsql/user');
const resData = require('../../../global.config').resData;
const token = require('../../../middleware/token');
const TOKEN_TIME = 60 * 60 * 24;
const createdToken = token.createToken;

exports.registerFun = function(req, res, next) {
    //生成用户信息表
    let { operator = null, type = null, username, number, password } = req.body;
    password = crypto.createHmac('sha1', JSON.stringify(password)).digest('base64');
    let reqData = { username, number, password };
    if(operator){
        reqData.operator = operator;
    }
    if(type){
        reqData.type = type;
    }
    //未验证是否数据库中有此数据
    userDB.addUser(reqData,function(result){
        if(result.success == 1){
            resData(res, typeCode.CONSUMER, true, typeCode.REGISTER_SAVE_SUCCESS);
        }else{
            resData(res, typeCode.CONSUMER, false, typeCode.REGISTER_SAVE_ERR);
        }
    })
}

exports.loginFun = function (req, res, next) {
    let { number, password } = req.body;
    password = crypto.createHmac('sha1', JSON.stringify(password)).digest('base64');
    let findData = {
        number,
        password
    }
    var findUserData = new Promise(function(resolve, reject){
        userObj.findOne(findData,{},function(err, doc){
            var obj = {};
            if (err || !doc) {
                obj.roles = [];
                obj.id = '';
            }else{
                obj.roles = doc.roles;
                obj.id = doc._id;
            }
            resolve(obj)
        })
    })
    findUserData.then(function(obj){
        //处理账户不存在情况
        if(!obj.id){
            return resData(res, typeCode.CONSUMER, false, '账号或密码错误！');
        }
        obj.number = findData.number;
        let tokenStr = JSON.stringify(obj);
        let tokenData = createdToken(tokenStr, TOKEN_TIME);
        //更新token
        userObj.findAndModify({number: obj.number}, [], { $set: { token: tokenData } }, {new:true}, function (err,doc) {
            if (err) {
                return resData(res, typeCode.CONSUMER, false, typeCode.LOGIN_FIND_ERR);
            }
            resData(res, typeCode.CONSUMER, true, doc.value.token);
        });
    })
}

exports.getUserInfo = function (req, res, next) {
    let findData = {
        token: req.query.token
    }
    let limitData = {
        'password': 0
    }
    //查询数据
    userObj.findOne(findData, limitData, function (err, doc) {
        if (err || !doc || doc.length == 0) {
            return resData(res, typeCode.CONSUMER, false, typeCode.LOGIN_FIND_ERR);
        }
        resData(res, typeCode.CONSUMER, true, doc);
    })
}

exports.changePasswordFun = function (req, res, next) {
    var number = req.body.number;
    var newPassword = req.body.newPassword;
    var findData = {
        number: number
    }
    var upData = {
        password: newPassword
    }
    userObj.update(findData, upData, function (err, doc) {
        if (err || doc.length == 0) {
            return resData(res, typeCode.CONSUMER, false, typeCode.CHANGE_PASSWORD_ERR);
        }
        resData(res, typeCode.CONSUMER, true, doc);
    })
}

exports.logOutFun = function(req, res, next){
    const user = req.body.user;
    let sid = mongoose.Types.ObjectId(user);
    let findData = {
        _id: sid
    }
    let upData = {
        $set: {token: null} 
    }
    //删除token
    userObj.update(findData, upData, {},function (err, doc) {
        if (err || doc.length == 0) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}
