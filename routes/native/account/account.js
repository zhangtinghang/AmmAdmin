"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const resData = require('../../../global.config').resData;
const userObj = Schema.userObj;
const qs = require("qs");

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
 * 批量注册账号数据
 */
exports.bulkRegister = function(req, res, next){
    let request = qs.parse(req.body);
    let bulkData = request.bulkData;
    let newBulk = [];
    //构造存入数据库中的数据
    for(let i=0;i<bulkData.length;i++){
        let obj = {};
        obj.name = bulkData[i]['姓名'];
        obj.password = '123456';
        obj.number = bulkData[i]['学号'];
        obj.type = bulkData[i]['所属部门'];
        newBulk.push(obj);
    }
    // 存入数据库中
    userObj.create(newBulk, function (err, docs) {
        //提取失败数据
        for(let i=0;i<docs.length;i++){
            for(let j=0; j<bulkData.length;j++){
                if(docs[i].number == bulkData[j]['学号']){
                    bulkData.splice(j, 1);
                }
            }
        }
        res.json({errno: typeCode.CONSUMER, success:true, succData:docs, errData: bulkData});
    })
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