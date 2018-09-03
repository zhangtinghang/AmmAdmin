// import { prototype } from 'stream';
"use strict"
const express = require('express');
const router = express.Router();
const token = require('../../middleware/token');
const decodeToken = token.decodeToken;
const checkToken = token.checkToken;


// 路由方法相关
const user = require('./login/login'); 
const account = require('./account/account'); 
const blog = require('./blog/blog');
const portfolio = require('./portfolio/portfolio');
const download = require('./download/download');
const notice = require('./notice/notice');
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


//账号相关
/* POST users register listing. */
const registerFun = user.registerFun;
router.post('/public/register', registerFun);
/* POST users login listing. */
const loginFun = user.loginFun;
router.post('/public/login', loginFun);
/* GET user info listing. */
const getUserInfo = user.getUserInfo;
router.get('/encrypt/getUserInfo', getUserInfo);
/* POST users password changed listing. */
const changePasswordFun = user.changePasswordFun;
router.post('/public/changePassword', changePasswordFun);
const logOutFun = user.logOutFun;
router.post('/encrypt/logOut', logOutFun);


// 博文相关
/* POST add blog listing. */
const blogAddFun = blog.blogAddFun;
router.post('/encrypt/blog', blogAddFun);
/* GET get All blog listing. */
const getBlogFun = blog.getBlogFun;
router.get('/encrypt/blog', getBlogFun);
/**
 * remove blog by _id
 */
const blogDelFun = blog.blogDelFun;
router.post('/encrypt/blogRemove', blogDelFun);
/**
 * modify blog by _id
 */
const blogModifyFun = blog.blogModifyFun;
router.post('/encrypt/blogModify', blogModifyFun);


//作品集相关
/* POST add portfolio listing. */
const addPortfolioFun = portfolio.addPortfolioFun;
router.post('/encrypt/portfolio', addPortfolioFun);

/* GET get All portfolio listing. */
const getPortfolioFun = portfolio.getPortfolioFun;
router.get('/encrypt/portfolio',getPortfolioFun);

/* POST get cover portfolio listing. */
const upCoverFun = portfolio.upCoverFun;
router.post('/public/portfolio/upCover', upCoverFun);

/**
 * remove portfolio by _id
 */
const portfolioDelFun = portfolio.portfolioDelFun;
router.post('/encrypt/portolioRemove', portfolioDelFun);

/**
 * modify portfolio by _id
 */
const portfolioModifyFun = portfolio.portfolioModifyFun;
router.post('/encrypt/portfolioModify', portfolioModifyFun);


//账号信息相关
/* GET account list listing. */
const getUserList = account.getUserList;
router.get('/encrypt/getUserList', getUserList);

/* POST account change listing. */
const updateAccount = account.updateAccount;
router.post('/encrypt/updateAccount', updateAccount);

/* POST account change listing. */
const findAccount = account.findAccount;
router.post('/encrypt/findAccount', findAccount);

/* POST account change listing. */
const changeAccStatus = account.changeAccStatus;
router.post('/encrypt/changeAccStatus', changeAccStatus);

/* POST account change listing. */
const delAccount = account.delAccount;
router.post('/encrypt/delAccount', delAccount);


//下载信息
const uploadFun = download.uploadFun;
router.post('/public/upload', uploadFun);

const addDownFun = download.addDownFun;
router.post('/encrypt/addDown',addDownFun);

const getDownFun = download.getDownFun;
router.get('/encrypt/getDown',getDownFun);

const delDownFun = download.delDownFun;
router.post('/encrypt/delDown',delDownFun);

const modDownFun = download.modDownFun;
router.post('/encrypt/modDown',modDownFun);

const updateDownLoad = download.updateDownLoad;
router.post('/encrypt/updDown',updateDownLoad);


//公告信息
const addNoticeFun = notice.addNoticeFun;
router.post('/encrypt/addNotice',addNoticeFun);

const getNoticeFun = notice.getNoticeFun;
router.get('/encrypt/getNotice',getNoticeFun);

const delNoticeFun = notice.delNoticeFun;
router.post('/encrypt/delNotice',delNoticeFun);

const modNoticeFun = notice.modNoticeFun;
router.post('/encrypt/modNotice',modNoticeFun);

const updNoticeFun = notice.updNoticeFun;
router.post('/encrypt/updNotice',updNoticeFun);

module.exports = router;