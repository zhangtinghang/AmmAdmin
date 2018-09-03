"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const noticeObj = Schema.noticeObj;

const resData = require('../../../global.config').resData;

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