"use strict"
const mongoose = require('mongoose');
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const downloadObj = Schema.downloadObj;

const resData = require('../../../global.config').resData;
const root = require('../../../global.config').root;
/* 图片上传模块引入 */
const path = require("path");
const fs = require("fs");
const formidable = require('../../../node_modules/formidable');
// 解析传递上来的数据，前端使用x-www-form-urlencoded
const qs = require("qs");
//md5
const md5 = require('md5');

exports.uploadFun = function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(root + "/public/upload");
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; 
    var allFile=[];
    form.on('progress', function(bytesReceived, bytesExpected) {//在控制台打印文件上传进度
        var progressInfo = { 
           value: bytesReceived, 
           total: bytesExpected 
        }; 
        console.log('[progress]: ' + JSON.stringify(progressInfo)); 
      })
     .on('error', function(err) {
       console.error('上传失败：', err.message); 
       next(err); 
     })
    //处理上传文件
    form.parse(req, function (err, fields, files) {
        //暂不做token验证
        console.log(err, fields, files.file.name)
        var filename = files.file.name;
        var nameArray = filename.split('.');
        var type = nameArray[nameArray.length - 1];
        var name = '';
        for (var i = 0; i < nameArray.length - 1; i++) {
            name = name + nameArray[i];
        }
        var date = new Date();
        var time = '_' + date.getFullYear() + "_" + date.getMonth() + "_" + date.getDay();
        var imagesName = md5(name + time) + '.' + type;
        var newPath = form.uploadDir + "/" + imagesName;
        fs.renameSync(files.file.path, newPath); //重命名
        res.send({
            success:true,
            errno:0,
            data:{name:files.file.name,url:"/upCover/" + imagesName}
        })
    })
}

exports.addDownFun = function (request, res, next) {
    var req = qs.parse(request.body);
    console.log(req)
    var user = req.user;
    var title = req.dataObj.title;
    var startTime = req.dataObj.startTime;
    var endTime = req.dataObj.endTime,
    content = req.dataObj.content,
    status = req.dataObj.status,
    isOpen = req.dataObj.isOpen,
    category = req.dataObj.category,
    sid = mongoose.Types.ObjectId(user);
    var links = {};
    links.url = req.dataObj.links;
    links.name = req.dataObj.linkName;
    let reqData = {
        user: sid,
        title: title,
        startTime:startTime,
        endTime:endTime,
        content:content,
        links:links,
        status:status,
        isOpen:isOpen,
        category:category
    }
    let download = new downloadObj(reqData)
    download.save(function (err) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}


exports.getDownFun = function (req, res, next) {
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
    downloadObj.count(function(err, count) {
        if(err){
            return false;
        }
        countNum = count
    });
    if (_id) {
        let id = mongoose.Types.ObjectId(_id);
        if(nextNum - preNum > 0){
            var query = downloadObj.find({'_id': {"$lt": id}});
        }else{
            var query = downloadObj.find({'_id': {"$gt": id}});
        }
    }else {
        var query = downloadObj.find({});       
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

exports.delDownFun = function (req, res, next) {
    var downId = req.body._id;
    var downloadId = mongoose.Types.ObjectId(downId);
    downloadObj.findByIdAndRemove(downloadId,{},function(err, result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}

/**
 * 修改下载信息状态
 */
exports.modDownFun = function (req, res, next) {
    let downId = req.body._id;
    let status = parseInt(req.body.status);
    if(status == 0){
        status = 1;
    }else if(status == 1){
        status = 0;
    }
    let update = {
        status: status
    }
    let query = downloadObj.findByIdAndUpdate(downId,update,{new:true});
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
exports.updateDownLoad = function(req, res, next){
    var req = qs.parse(req.body);
    let id = req.dataObj._id;
    var ID = mongoose.Types.ObjectId(id);
    let updateObj = req.dataObj;
    downloadObj.findByIdAndUpdate(ID,updateObj,{new:true},function(err,result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}