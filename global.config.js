"use strict"
/**
 * 
 * @param {*} res 
 * @param {*} errno 
 * @param {*} success 
 * @param {*} data 
 * 设计缺陷，应当动态遍历属性值，可定制性差（后期修复）
 */
function response(res,errno,success,data){
    let errnoNum = errno || 0;
    return res.json({
        errno: errno,
        success:success,
        data: data
    })
}

module.exports = {
    resData:response,
    root:__dirname
}