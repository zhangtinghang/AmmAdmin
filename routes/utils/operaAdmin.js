const payload = require('./index').payload;
const resData = require('../../global.config').resData;
const typeCode = require('../../typeCode');
const mongoose = require('mongoose');
const qs = require('qs');
var selectData = function (req, res, findSchema) {
    let {
        id,
        limit,
        preNum,
        nextNum
    } = req.query;
    let rolesType = payload(req.payload.roles);
    let user = req.payload.id;
    let limitNum = parseInt(limit);
    let skips = null;
    if (nextNum - preNum > 0) {
        skips = (nextNum - preNum - 1) * limitNum;
    } else {
        skips = (preNum - nextNum - 1) * limitNum;
    }
    //对查询过滤
    let query = null;
    let findObj = {};
    if (id) {
        let _id = mongoose.Types.ObjectId(id);
        if (nextNum - preNum > 0) {
            findObj._id = {
                "$lt": _id
            }
        } else {
            findObj._id = {
                "$gt": _id
            };
        }
    }
    /**
     * 处理普通用户，编辑用户
     */
    if (rolesType == 2) {
        findObj.user = mongoose.Types.ObjectId(user);
    }

    //查询数据
    query = findSchema.find(findObj);
    //处理排序顺序
    if (nextNum - preNum > 0) {
        query.sort({
            '_id': -1
        })
    } else {
        query.sort({
            '_id': 1
        })
    }

    query.skip(skips)
    query.limit(limitNum)
    query.populate({
        path: 'user',
        select: 'username number avatar createTime updateTime'
    })
    query.exec(function (err, docs) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.UESER_GET_ERR);
        }
        if (nextNum - preNum < 0) {
            docs.sort(function (a, b) {
                return b._id.getTimestamp() - a._id.getTimestamp();
            })
        }
        //查询条数
        //重新构造查找的数量
        delete findObj._id
        findSchema.count(findObj, function (err, c) {
            if (err) {
                return resData(res, typeCode.CONSUMER, false, typeCode.UESER_GET_ERR);
            }
            res.json({
                errno: typeCode.CONSUMER,
                success: true,
                count: c,
                data: docs
            });
        });

    })
}

/**
 * 添加数据到数据库中
 */
const addData = function (res, reqData, SchemaObj) {
    let newSchema = new SchemaObj(reqData)
    newSchema.save(function (err) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.BLOG_SAVE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.BLOG_SAVE_SUCCESS);
    })
}

/**
 * 修改数据库中数据的状态
 */

const modifyStatusData = function (req, res, SchemaObj) {
    let blogId = req.body._id;
    let status = parseInt(req.body.status);
    if (status == 0) {
        status = 1;
    } else if (status == 1) {
        status = 0;
    }
    let update = {
        status
    };
    let query = SchemaObj.findByIdAndUpdate(blogId, update, {
        new: true
    });
    query.exec(function (err, result) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}

/**
 * 删除数据库中的数据
 */

const deleteData = function (req, res, schemaObj) {
    var schemaId = req.body._id;
    let id = mongoose.Types.ObjectId(schemaId);
    schemaObj.findByIdAndRemove(id, {}, function (err, result) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, typeCode.OPERATE_SUCCRSS);
    })
}

/**
 * 更新数据库中的数据
 */
const updateData = function (req, res, schemaObj) {
    console.log(req)
    var req = qs.parse(req.body);
    let id = req._id;
    var ID = mongoose.Types.ObjectId(id);
    let updateObj = req.dataObj;
    schemaObj.findByIdAndUpdate(ID, updateObj, {
        new: true
    }, function (err, result) {
        if (err) {
            return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
        }
        resData(res, typeCode.CONSUMER, true, result);
    })
}
module.exports = {
    selectData,
    addData,
    modifyStatusData,
    deleteData,
    updateData
}