"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const resData = require('../../../global.config').resData;
const userObj = Schema.userObj;
const qs = require('qs');
/**
 * 修改账号数据
 */
exports.updateAccount = function(req, res, next){
    var req = qs.parse(req.body);
    let id = req._id;
    var ID = mongoose.Types.ObjectId(id);
    let updateObj = req.dataObj;
    userObj.findByIdAndUpdate(ID,updateObj,{new:true},function(err,result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
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
    let id = req.body._id;
    var ID = mongoose.Types.ObjectId(id);
    let status = req.body.status;
    if(status == 0){
        status = 1;
    }else if(status == 1){
        status = 0;
    }
    let update = {
        status: status
    }
    userObj.findByIdAndUpdate(ID,update,{new:true},function(err, result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}

 /**
 * 根据_id删除账号
 */
exports.delAccount = function (req, res, next) {
    var id = req.body._id;
    var ID = mongoose.Types.ObjectId(id);
    userObj.findByIdAndRemove(ID,{},function(err, result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}

/**
 * 获取用户列表
 */
exports.getUserList = function(req, res, next){
    let _id = req.query.id;
    let limitNum = req.query.limit;
    let preNum = req.query.preNum;
    let nextNum = req.query.nextNum;
    let countNum = 0;
    limitNum = parseInt(limitNum);
    let skips = null;
    if(nextNum - preNum > 0){
        skips  = (nextNum - preNum -1)*limitNum;
    }else{
        skips  = (preNum - nextNum -1)*limitNum;
    }
    userObj.count(function(err, count) {
        if(err){
            return false;
        }
        countNum = count
    });
    if (_id) {
        let id = mongoose.Types.ObjectId(_id);
        if(nextNum - preNum > 0){
            var query = userObj.find({'_id': {"$lt": id}});
        }else{
            var query = userObj.find({'_id': {"$gt": id}});
        }
    }else {
        var query = userObj.find({});       
    }
    //查询数据
    if(nextNum - preNum > 0){
        query.sort({'_id': -1})
    }else{
        query.sort({'_id': 1})
    }
    query.skip(skips)
    query.limit(limitNum)
    query.select('-password')
    query.exec(function(err, docs){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.UESER_GET_ERR);
        }
        if(nextNum - preNum < 0){
            docs.sort(function(a,b){
                return b._id.getTimestamp() - a._id.getTimestamp();
            })
        }
        res.json({errno: typeCode.CONSUMER, success:true, count:countNum, data: docs});     
    })
}