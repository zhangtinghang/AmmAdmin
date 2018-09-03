
"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const touristObj = Schema.touristObj; 
//操作数据库
const userDB = require('../../../dbsql/user');
const resData = require('../../../global.config').resData;
const token = require('../../../middleware/token');
const TOKEN_TIME = 60 * 60 * 24;
const createdToken = token.createToken;

exports.loginFun = function (req, res, next) {
    let findUser = mongoose.model('userObj');
    let findData = {
        number: req.body.number
    }
    //处理游客模式
    if(req.body.tourist){
        findData.roles = ['tourist'];
        findData.intro = req.body.intro;
        // let tokenData = createdToken(findData, 60 * 60 * 24 * 365);
        let tokenData = 'eyJkYXRhIjp7Im51bWJlciI6ImFhMjZjM2VmZDU2NmRiZTVhYzI2MWVjNGI1N2E2ZDY1Iiwicm9sZXMiOlsidG91cmlzdCJdfSwiY3JlYXRlZCI6MTUzNTg4Mzc1NSwiZXhwIjozMTUzNjAwMH0=.aONQ6IsLOCpzw4uL6sinCETLBgnJS+HUsbpLgcNyZkQ=';
        findData.token = tokenData;
        resData(res, typeCode.CONSUMER, true, tokenData);
        //存入数据库中
        touristObj.update({number: req.body.number},{$set:findData},{upsert:true}, function(err, doc){})     
        return false;
    }

    var findUserData = new Promise(function(resolve, reject){
        findUser.findOne(findData,{},function(err, doc){
            var roles = null;
            if (err) {
                roles = [];
            }else{
                roles = doc.roles;
            }
            resolve(roles)
        })
    })
    findUserData.then(function(roles){
        findData.roles = roles;
        let tokenStr = JSON.stringify(findData);
        let tokenData = createdToken(tokenStr, TOKEN_TIME);
        //更新token
        findUser.findAndModify({number: findData.number}, [], { $set: { token: tokenData } }, {new:true}, function (err,doc) {
            if (err) {
                return resData(res, typeCode.CONSUMER, false, typeCode.LOGIN_FIND_ERR);
            }
            resData(res, typeCode.CONSUMER, true, doc.value.token);
        });
    })

}

exports.getUserInfo = function (req, res, next) {
    console.log('获取token====', req.query.token)
    let findUser = mongoose.model('userObj');
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
