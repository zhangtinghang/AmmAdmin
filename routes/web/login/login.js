
"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const touristObj = Schema.touristObj; 
const payload = require('../../utils/index').payload;
const crypto = require("crypto");
//操作数据库
const userDB = require('../../../dbsql/user');
const resData = require('../../../global.config').resData;
const token = require('../../../middleware/token');
const TOKEN_TIME = 60 * 60 * 24;
const createdToken = token.createToken;


/**
 * 前端游客模式登陆(若无此浏览器，则自动注册)
 * @param number
 */
 exports.loginTourist = function(req, res, next){
    let { number, intro } = req.body;
    let findData = {
        number,
        intro
    }
    findData.roles = ['tourist'];
    let tokenData = createdToken(findData, 60 * 60 * 24 * 365);
    findData.token = tokenData;
    //存入数据库中
    let registPromise = new Promise(function(resolve, reject){
       touristObj.update({number: findData.number},{$set:findData},{upsert: true}, function(err, doc){
            if(err){
                reject({type:1, data: err})
            }
            resolve(doc)
        })
    })
    //获取登陆token
    registPromise
    .then(function(){
        //返回用户信息
        resData(res, typeCode.CONSUMER, true, findData.token);
    }).catch(err => resData(res, typeCode.CONSUMER, false, '出现未知错误,请联系管理员！'));
}

 /**
 * 前端正常用户登录
 */
exports.loginFun = function (req, res, next) {
    let findUser = mongoose.model('userObj');
    let { number, password } = req.body;
    password = crypto.createHmac('sha1', JSON.stringify(password)).digest('base64');
    let findData = {
        number,
        password
    }
    var findUserData = new Promise(function(resolve, reject){
        findUser.findOne(findData,{},function(err, doc){
            var obj = {};
            if (err || !doc) {
                obj.roles = [];
                obj.id = '';
            }else {
                obj.roles = doc.roles;
                obj.id = doc._id;
            }
            resolve(obj)
        })
    })
    findUserData.then(function(obj){
        if(!obj.id){
            return resData(res, typeCode.CONSUMER, false, '账号或密码错误！');
        }
        obj.number = findData.number;
        let tokenStr = JSON.stringify(obj);
        let tokenData = createdToken(tokenStr, TOKEN_TIME);
        // 更新token
        findUser.findAndModify({number: obj.number}, [], { $set: { token: tokenData } }, {new:true}, function (err,doc) {
            if (err) {
                return resData(res, typeCode.CONSUMER, false, typeCode.LOGIN_FIND_ERR);
            }
            resData(res, typeCode.CONSUMER, true, doc.value.token);
        });
    })
}

/**
 * 获取用户信息
 */

exports.getUserInfo = function (req, res, next) {
    console.log('token===',req.payload)
    let findUser = null;
    let rolesType = payload(req.payload.roles);
    if(rolesType == 1){
        findUser = mongoose.model('touristObj');
    }else{
        findUser = mongoose.model('userObj');
    }
    let findData = {
        token: req.query.token
    }
    let limitData = {
        'password': 0
    }
    //查询数据
    findUser.findOne(findData, limitData, function (err, doc) {
        if (err || !doc || doc.length == 0) {
            return resData(res, typeCode.CONSUMER, false, typeCode.LOGIN_FIND_ERR);
        }
        resData(res, typeCode.CONSUMER, true, doc);
    })
}

/** 
 * 修改密码
 * @param conditions 
 * @param callback 
 */  
exports.changePasswordFun = function (req, res, next) {
    let findUser = mongoose.model('userObj');
    var number = req.body.number;
    var newPassword = req.body.newPassword;
    var findData = {
        number: number
    }
    var upData = {
        password: newPassword
    }
    findUser.update(findData, upData, function (err, doc) {
        if (err || doc.length == 0) {
            return resData(res, typeCode.CONSUMER, false, typeCode.CHANGE_PASSWORD_ERR);
        }
        resData(res, typeCode.CONSUMER, true, doc);
    })
}

/**
 * 退出登陆
 */

exports.logOutFun = function(req, res, next){
    const user = req.body.user;
    const findUser = mongoose.model('userObj');
    let sid = mongoose.Types.ObjectId(user);
    let findData = {
        _id: sid
    }
    let upData = {
        $set: {token: null} 
    }
    //删除token
    findUser.update(findData, upData, {},function (err, doc) {
        if (err || doc.length == 0) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}
