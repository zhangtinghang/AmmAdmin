
"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
//操作数据库
const userDB = require('../../../dbsql/user');
const resData = require('../../../global.config').resData;
const token = require('../../../middleware/token');
const TOKEN_TIME = 60 * 60 * 24;
const createdToken = token.createToken;

exports.registerFun = function(req, res, next) {
    //生成用户信息表
    let oper = req.body.operator || null;
    let reqData = {
        username: req.body.username,
        number: req.body.number,
        password: req.body.password
    }
    if(oper){
        reqData.operator = oper;
    }
    //未验证是否数据库中有此数据
    userDB.addUser(reqData,function(result){
        console.log('注册成功返回',result)
        if(result.success == 1){
            resData(res, typeCode.CONSUMER, true, typeCode.REGISTER_SAVE_SUCCESS);
        }else{
            resData(res, typeCode.CONSUMER, false, typeCode.REGISTER_SAVE_ERR);
        }
    })
}

exports.loginFun = function (req, res, next) {
    let findUser = mongoose.model('userObj');
    let findData = {
        number: req.body.number
    }
    var findUserData = new Promise(function(resolve, reject){
        findUser.findOne(findData,{},function(err, doc){
            var roles = null;
            if (err) {
                roles = [];
            }
            roles = doc.roles;
            resolve(roles)
        })
    })
    findUserData.then(function(roles){
        findData.roles = roles;
        let tokenStr = JSON.stringify(findData);
        let tokenData = createdToken(tokenStr, TOKEN_TIME);
        let limitData = {
            'password': 0
        }
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

