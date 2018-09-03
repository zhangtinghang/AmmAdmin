"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const noticeObj = Schema.noticeObj;

const resData = require('../../../global.config').resData;
const root = require('../../../global.config').root;
// 解析传递上来的数据，前端使用x-www-form-urlencoded
const qs = require("qs");

exports.addNoticeFun = function (req, res, next) {
    var req = qs.parse(req.body);
    var user = req.user;
    var title = req.dataObj.title;
    var startTime = req.dataObj.startTime;
    var endTime = req.dataObj.endTime,
    content = req.dataObj.content,
    status = req.dataObj.status,
    category = req.dataObj.category,
    isOpen = req.dataObj.isOpen,
    sid = mongoose.Types.ObjectId(user);
    let reqData = {
        user: sid,
        title: title,
        startTime:startTime,
        endTime:endTime,
        content:content,
        status:status,
        isOpen:isOpen,
        category:category
    }
    let notice = new noticeObj(reqData)
    notice.save(function (err) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}


exports.getNoticeFun = function (req, res, next) {
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
    noticeObj.count(function(err, count) {
        if(err){
            return false;
        }
        countNum = count
    });
    if (_id) {
        let id = mongoose.Types.ObjectId(_id);
        if(nextNum - preNum > 0){
            var query = noticeObj.find({'_id': {"$lt": id}});
        }else{
            var query = noticeObj.find({'_id': {"$gt": id}});
        }
    }else {
        var query = noticeObj.find({});       
    }
    //查询数据
    if(nextNum - preNum > 0){
        query.sort({'_id': -1})
    }else {
        query.sort({'_id': 1})
    }
    query.skip(skips)
    query.limit(limitNum)
    query.populate({path:'user',select:'username number avatar createTime updateTime'})
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

/**
 * 根据_id删除下载信息
 */

exports.delNoticeFun = function (req, res, next) {
    var noId = req.body._id;
    var noticeId = mongoose.Types.ObjectId(noId);
    noticeObj.findByIdAndRemove(noticeId,{},function(err, result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}

/**
 * 修改下载信息状态
 */
exports.modNoticeFun = function (req, res, next) {
    let noId = req.body._id;
    let status = parseInt(req.body.status);
    if(status == 0){
        status = 1;
    }else if(status == 1){
        status = 0;
    }
    let update = {
        status: status
    }
    let query = noticeObj.findByIdAndUpdate(noId,update,{new:true});
    query.exec(function(err,result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}

/**
 * 修改下载信息内容
 */
exports.updNoticeFun = function(req, res, next){
    var req = qs.parse(req.body);
    let id = req.dataObj._id;
    var ID = mongoose.Types.ObjectId(id);
    let updateObj = req.dataObj;
    noticeObj.findByIdAndUpdate(ID,updateObj,{new:true},function(err,result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}