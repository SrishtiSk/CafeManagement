const express = require('express');
const connection = require('../connection');
const router = express.Router();
const auth = require('../services/authentication');

router.get('/details', auth.authenticateToken, (req, res, next)=>{
 var categoryCount;
 var productCount;
 var billCount;
 var query = `SELECT count(id) AS categoryCategory FROM Category`;
 connection.query(query, (error, results)=>{
    if(!error){
        categoryCount=results[0].categoryCategory;

    }else{
        return res.status(500).json(error);
    }
 })
 var query=`SELECT count(id) as productCount FROM Product`;
 connection.query(query, (error, results)=>{
    if(!error){
        productCount=results[0].productCount;

    }else{
        return res.status(500).json(error);
    }
 });
 var query = `SELECT count(billNo) AS billCount FROM Bill`;
 connection.query(query, (error, results)=>{
    if(!error){
        billCount=results[0].billCount;
        var data = {
            category:categoryCount,
            product:productCount,
            bill:billCount
        };
        return res.status(200).json(data);
    }else{
        return res.status(500).json(error);
    }
 })
});

module.exports = router;