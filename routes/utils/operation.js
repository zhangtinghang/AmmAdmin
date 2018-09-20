    const payload = require('./index').payload;
    const resData = require('../../global.config').resData;
    const typeCode = require('../../typeCode');
    const mongoose = require('mongoose');
    const qs = require('qs');
    var selectData = function (req, res, blogObj) {
        let {
            id,
            limit,
            preNum,
            nextNum,
            category
        } = req.query;
        let rolesType = payload(req.payload.roles);
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
         * 处理游客，普通用户模式
         */
        if (rolesType <= 1) {
            findObj.isOpen = true;
        }

        /**
         * 判断查询类型
         * 分类查询，所有查询
         */
        if (category) {
            findObj.category = category
        }
        //查询数据
        findObj.status = 0;
        query = blogObj.find(findObj);
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
            blogObj.count(findObj, function (err, c) {
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
    const addData = function () {

    }

    /**
     * 更新数据库中的数据
     */
    const updateData = function (req, res, schemaObj) {
        let request = qs.parse(req.body);
        let id = request._id;
        let ID = mongoose.Types.ObjectId(id);
        let updateObj = request.dataObj;
        delete updateObj.token
        console.log(updateObj)
        schemaObj.findByIdAndUpdate(ID, updateObj, {
            new: true
        }, function (err, result) {
            if (err) {
                return resData(res, typeCode.CONSUMER, false, typeCode.OPERATE_ERR);
            }
            resData(res, typeCode.CONSUMER, true, result);
        })
    }

    /**
     * 修改数据库中的数据
     */

    const modifyData = function () {

    }

    /**
     * 删除数据库中的数据
     */

    const deleteData = function () {

    }
    module.exports = {
        selectData,
        addData,
        modifyData,
        deleteData,
        updateData
    }