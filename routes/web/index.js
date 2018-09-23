// import { prototype } from 'stream';
"use strict"
const express = require('express');
const router = express.Router();
const token = require('../../middleware/token');
const decodeToken = token.decodeToken;
const checkToken = token.checkToken;


// 路由方法相关
const user = require('./login/login');
const blog = require('./blog/blog');
const portfolio = require('./portfolio/portfolio');
const download = require('./download/download');
const notice = require('./notice/notice');
const account = require('./account/account');
/* POST encrypt verify listing. */
router.use('/encrypt', function (req, res, next) {
    if(req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1');
        res.header("Access-Control-Max-Age" ,"86400"); 
        res.header("Access-Control-Allow-Headers" , "Content-Type"); 
        res.header("Content-Type", "application/json;charset=utf-8");
        res.end();
    }else {
        let token = req.body.token || req.query.token;
        let decodeData = decodeToken(token);
        let checkData = checkToken(decodeData);
        if (checkData) {
            try {
                req.payload = JSON.parse(decodeData.payload.data);
            } catch (error) {
                req.payload = decodeData.payload.data;
            }
            next();
        } else {
            res.json(checkData);
        }
    }
})

//登陆相关
/* POST users login listing. */
const loginFun = user.loginFun;
router.post('/public/login', loginFun);

const loginTourist = user.loginTourist;
router.post('/public/touristLogin',loginTourist);

/* GET user info listing. */
const getUserInfo = user.getUserInfo;
router.get('/encrypt/getUserInfo', getUserInfo);
/* POST users password changed listing. */
// const changePasswordFun = user.changePasswordFun;
// router.post('/public/changePassword', changePasswordFun);

const logOutFun = user.logOutFun;
router.post('/encrypt/logOut', logOutFun);

// 博文相关
/* GET get All blog listing. */
const getBlogFun = blog.getBlogFun;
router.get('/encrypt/blog', getBlogFun);

//作品集相关
/* GET get All portfolio listing. */
const getPortfolioFun = portfolio.getPortfolioFun;
router.get('/encrypt/portfolio', getPortfolioFun);

//下载信息
const getDownFun = download.getDownFun;
router.get('/encrypt/getDown', getDownFun);

//公告信息
const getNoticeFun = notice.getNoticeFun;
router.get('/encrypt/getNotice', getNoticeFun);

//账号信息
const updateAccount = account.updateAccount;
router.post('/encrypt/updateAccount', updateAccount);

const modifyPwd = account.modifyPwd;
router.post('/encrypt/modifyPwd', modifyPwd);
module.exports = router;