"use strict"
const mongoose = require('mongoose');
const Schema = require('../../../Schema/Schema');
const portfolioObj = Schema.portfolioObj; 

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

/**
 * 添加作品集
 */
exports.addPortfolioFun = function (req, res, next) {

    let { user, title, intro, cover, links, category, team_name, content, testimonial, technology  } = qs.parse(req.body);

    user = mongoose.Types.ObjectId(user);

    let reqData = { user, title, intro, category, cover, team_name, content, links, technology, testimonial };

    addData(res, reqData, portfolioObj);
}

/**
 * 查询作品集
 */

exports.getPortfolioFun =  function (req, res, next) {
    getDtata(req, res, portfolioObj);
}


/**
 * 上传作品集封面
 */
exports.upCoverFun = function (req, res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = path.join(root + "/public/upCover");
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;
    //处理图片
    form.parse(req, function (err, fields, files) {
        //暂不做token验证
        let userid = fields.userid,
            token = fields.token;
        // console.log(userid,token)
        var filename = files.images.name;
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
        fs.renameSync(files.images.path, newPath); //重命名
        res.send({
            data: "/upCover/" + imagesName
        })
    })
}

/**
 * 根据_id删除作品集
 */

exports.portfolioDelFun = function (req, res, next) {
    deleteData(req, res, portfolioObj);
}

/**
 * 修改作品集状态
 */
exports.portfolioModifyFun = function (req, res, next) {
    modifyStatusData(req, res, portfolioObj);
}