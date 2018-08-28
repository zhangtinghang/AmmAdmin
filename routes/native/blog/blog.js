"use strict"
const mongoose = require('mongoose');
const openDb = require('../../../db.config').openDb;
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const blogObj = Schema.blogObj;

const resData = require('../../../global.config').resData;

exports.blogAddFun = function (req, res, next) {
    var user = req.body.user;
    var title = req.body.title;
    var intro = req.body.intro;
    var category = req.body.category;
    var blog = req.body.blog;
    var sid = mongoose.Types.ObjectId(user);
    let reqData = {
        user: sid,
        title: title,
        intro: intro,
        category: category,
        blog: blog
    }
    let newblog = new blogObj(reqData)

    newblog.save(function (err) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.BLOG_SAVE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.BLOG_SAVE_SUCCESS);
    })
}

exports.getBlogFun = function (req, res, next) {
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
    blogObj.count(function(err, count) {
        if(err){
            return false;
        }
        countNum = count
    });
    if (_id) {
        let id = mongoose.Types.ObjectId(_id);
        if(nextNum - preNum > 0){
            var query = blogObj.find({'_id': {"$lt": id}});
        }else{
            var query = blogObj.find({'_id': {"$gt": id}});
        }
    }else {
        var query = blogObj.find({});       
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
 * 根据_id删除博文
 */

exports.blogDelFun = function (req, res, next) {
    var blogId = req.body._id;
    var blogId = mongoose.Types.ObjectId(blogId);
    blogObj.findByIdAndRemove(blogId,{},function(err, result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}

/**
 * 修改博文状态
 */
exports.blogModifyFun = function (req, res, next) {
    let blogId = req.body._id;
    let status = parseInt(req.body.status);
    if(status == 0){
        status = 1;
    }else if(status == 1){
        status = 0;
    }
    let update = {
        status: status
    }
    let query = blogObj.findByIdAndUpdate(blogId,update,{new:true});
    query.exec(function(err,result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}