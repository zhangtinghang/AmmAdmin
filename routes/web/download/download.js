"use strict"
const Schema = require('../../../Schema/Schema');
const downloadObj = Schema.downloadObj;
const getDtata = require('../../utils/operation').selectData;

exports.getDownFun = function (req, res, next) {
    getDtata(req, res, downloadObj);
}
