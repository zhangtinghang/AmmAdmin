const payload = function (roles){
    let tem = null;
    if(roles.indexOf('admin') >= 0){
        console.log('超级管理员模式')
        tem = 4;
    }else if(roles.indexOf('edit') >= 0){
        console.log('编辑模式')
        tem = 3;
    }else if(roles.indexOf('normal') >= 0){
        console.log('普通模式')
        tem = 2;
    }else if(roles.indexOf('tourist') >= 0){
        console.log('游客模式')
        tem = 1;
    }else {
        console.log('无权限')
        tem = 0;
    }
    return tem;
}

module.exports = {
    payload
}