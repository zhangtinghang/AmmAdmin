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

 /**
  * 基础增删改查声明
  */
 const getDtata = require('../../utils/operaAdmin').selectData;
 const addData = require('../../utils/operaAdmin').addData;
 const deleteData = require('../../utils/operaAdmin').deleteData;
 const modifyStatusData = require('../../utils/operaAdmin').modifyStatusData;
const updateData = require('../../utils/operaAdmin').updateData;

exports.uploadFun = function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(root + "/public/upload");
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; 
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
    let req = qs.parse(request.body);
    let user = req.user;
    let { title, startTime, endTime, content, status, isOpen, category } = req.dataObj;
    user = mongoose.Types.ObjectId(user);
    let links = {};
    links.url = req.dataObj.links;
    links.name = req.dataObj.linkName;
    let reqData = { user, title, startTime, endTime, content, links, status, isOpen, category };
    addData(res, reqData, downloadObj);
}


exports.getDownFun = function (req, res, next) {
    getDtata(req, res, downloadObj);
}

/**
 * 根据_id删除下载信息
 */

exports.delDownFun = function (req, res, next) {
    deleteData(req, res, downloadObj);
}

/**
 * 修改下载信息状态
 */
exports.modDownFun = function (req, res, next) {
    modifyStatusData(req, res, downloadObj);
}
/**
 * 修改下载信息内容
 */
exports.updateDownLoad = function(req, res, next){
    updateData(req, res, downloadObj);
}