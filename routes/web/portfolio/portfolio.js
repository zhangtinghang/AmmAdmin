"use strict"
const Schema = require('../../../Schema/Schema');
const portfolioObj = Schema.portfolioObj; 
const getDtata = require('../../utils/operation').selectData;

exports.getPortfolioFun =  function (req, res, next) {
    getDtata(req, res, portfolioObj);
}
