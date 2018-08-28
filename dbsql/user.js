const Schema = require('../Schema/Schema');
const userObj = Schema.userObj; 
const dbHelper = require('../dbhelper/dbhelper');
/** 
 * 调用公共add方法并且传入操作数据库的模型user 
 * @returns {Function} 
 */  
exports.addUser = function(reqData,conditions,callback) {  
    //获取user模型  
    
    var userModel = new userObj(reqData);
    dbHelper.addData(userModel,conditions,function(result) {  
        callback(result);   
    });  
};  
/** 
 * 调用公共find方法并且传入操作数据库的模型user 
 * @param conditions 
 * @param callback 
 */  
exports.findUser = function(conditions,callback) {
    var fields   = {};  
    var options  = {};  
  
    dbHelper.findData(userModel,conditions,fields,options,function(result){  
        callback(result);  
    });  
  
}  
  
/** 
 * 调用公共remove方法并且传入操作数据库的模型user 
 * @param conditions 
 * @param callback 
 */  
exports.removeUser = function(conditions,callback) {  

    dbHelper.removeData(userModel,conditions,function(result){  
        callback(result);  
    });  
}  
  
/** 
 * 调用公共update方法并且传入操作数据库的模型user 
 * @param conditions 
 * @param update 
 * @param options 
 * @param callback 
 */  
exports.updateUser = function(conditions,update,options,callback) {  

    dbHelper.updateData(userModel,conditions,update,options,function(result){  
        callback(result);  
    });  
}  