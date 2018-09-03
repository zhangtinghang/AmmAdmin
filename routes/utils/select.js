    const payload = require('./index').payload;
    const resData = require('../../global.config').resData;
    const typeCode = require('../../typeCode');
var select = function(req, res, blogObj){
    let rolesType = payload(req.payload.roles);
    let _id = req.query.id;
    let limitNum = req.query.limit;
    let preNum = req.query.preNum;
    let nextNum = req.query.nextNum;
    let category = req.query.category;
    limitNum = parseInt(limitNum);
    let skips = null;
    if(nextNum - preNum > 0){
        skips  = (nextNum - preNum -1)*limitNum;
    }else{
        skips  = (preNum - nextNum -1)*limitNum;
    }
    //对查询过滤
    let query = null;
    let findObj  = null;
    if (_id) {
        let id = mongoose.Types.ObjectId(_id);
        if(nextNum - preNum > 0){
            findObj = {
                '_id': {"$lt": id}
            }         
        }else{
            findObj = {
                '_id': {"$gt": id}
            }
        }
    }else {
        findObj = {};
    }
    //判断用户类型
    if(rolesType == 1){
        findObj.isOpen  = true;
    }
    //判断查询类型
    if(category){
        findObj.category = category
    }
    //查询数据
    query = blogObj.find(findObj);
    //处理排序顺序
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
        //查询条数
        blogObj.count(findObj, function(err, c) {
            if(err){
                return resData(res, typeCode.CONSUMER, false, typeCode.UESER_GET_ERR);
            }
            res.json({errno: typeCode.CONSUMER, success:true, count:c, data: docs});  
       });
           
    })
}
module.exports = {
    select
}