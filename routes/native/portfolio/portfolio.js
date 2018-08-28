"use strict"
const mongoose = require('mongoose');
const openDb = require('../../../db.config').openDb;
const typeCode = require('../../../typeCode');
const Schema = require('../../../Schema/Schema');
const portfolioObj = Schema.portfolioObj; 

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

exports.addPortfolioFun = function (req, res, next) {
    var req = qs.parse(req.body);
    var user = req.user;
    var title = req.title;
    var intro = req.intro;
    var cover = req.cover;
    var links = req.links;
    var category = req.category,
    team_name = req.team_name,
    content = req.content,
    testimonial = req.testimonial,
    technology = req.technology,
    sid = mongoose.Types.ObjectId(user);
    let reqData = {
        user: sid,
        title: title,
        intro: intro,
        category: category,
        cover: cover,
        team_name: team_name,
        content: content,
        links: links,
        technology: technology,
        testimonial: testimonial
    }
    let newProtfolio = new portfolioObj(reqData)
    newProtfolio.save(function (err) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.BLOG_SAVE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.BLOG_SAVE_SUCCESS);
    })
}

exports.getPortfolioFun =  function (req, res, next) {
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
    portfolioObj.count(function(err, count) {
        if(err){
            return false;
        }
        countNum = count
    });
    if (_id) {
        let id = mongoose.Types.ObjectId(_id);
        if(nextNum - preNum > 0){
            var query = portfolioObj.find({'_id': {"$lt": id}});
        }else{
            var query = portfolioObj.find({'_id': {"$gt": id}});
        }
    }else {
        var query = portfolioObj.find({});       
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
    var id = req.body._id;
    var ID = mongoose.Types.ObjectId(id);
    portfolioObj.findByIdAndRemove(ID,{},function(err, result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}

/**
 * 修改作品集状态
 */
exports.portfolioModifyFun = function (req, res, next) {
    console.log(req.body)
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
    let query = portfolioObj.findByIdAndUpdate(ID,update,{new:true});
    query.exec(function(err,result){
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}