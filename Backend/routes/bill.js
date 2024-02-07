const express = require('express');
const connection = require('../connection');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication');
const { error } = require('console');


//to genetrate report
router.post('/generateReport', auth.authenticateToken, (req, res)=>{
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    var query = `INSERT INTO Bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) VALUES (?,?,?,?,?,?,?,?)`;
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (error, results)=>{
        if(!error){
            ejs.renderFile(path.join(__dirname, '', "report.ejs"),{
                productDetails: productDetailsReport,
                name : orderDetails.name,
                email: orderDetails.email,
                contactNumber: orderDetails.contactNumber,
                paymentMethod: orderDetails.paymentMethod,
                totalAmount: orderDetails.totalAmount  
            },
            (err, response)=>{
                if(err){
                    console.log("ejs Failed")
                    return res.status(500).json(err);
                }else{
                    pdf.create(response).toFile('./generated_pdf/'+generatedUuid+".pdf", function(err, data){
                        if(err){
                            console.log("Error in creating PDF", err);
                            return res.status(500).json(err);
                        }else{
                            return res.status(200).json({uuid: generatedUuid});
                        }
                    })
                }
            });
        }else{
            return res.status(500).json(error);
        }
    });

});

//
router.post('/getPdf', auth.authenticateToken, function(req, res){
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf';
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);

    }else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails);
        console.log("billno", orderDetails.billNo);
        ejs.renderFile(path.join(__dirname, '', "report.ejs"),{
            productDetails: productDetailsReport,
            name : orderDetails.name,
            email: orderDetails.email,
            contactNumber: orderDetails.contactNumber,
            paymentMethod: orderDetails.paymentMethod,
            totalAmount: orderDetails.totalAmount  
        },
        (err, response)=>{
            if(err){
                console.log("ejs Failed")
                return res.status(500).json(err);
            }else{
                pdf.create(response).toFile('./generated_pdf/'+ orderDetails.uuid +".pdf", function(err, data){
                    if(err){
                        console.log("Error in creating PDF", err);
                        return res.status(500).json(err);
                    }else{
                        //return res.status(200).json({uuid: generatedUuid});
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                        
                    }
                })
            }
        })
    }
});

router.get('/getBills', auth.authenticateToken, (req, res, next)=>{
    var query = `SELECT * FROM Bill ORDER BY billNo DESC`;
    connection.query(query, (error, results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            console.log('Error while retrieving billing details');
            return res.status(500).json(error);
        }
    })
})

router.delete('/delete/:billNo', auth.authenticateToken, (req, res, next)=>{
    const billNo = req.params.billNo;
    var query = `DELETE FROM Bill WHERE billNo=?`;
    connection.query(query,[billNo], (error, results)=>{
        if (!error) {
            if(results.affectedRows ==0){
                return res.status(404).send(`Unable to find the bill with bill no ${billNo}`);
            }
            return res.status(200).json({message: "Bill deleted succssfully!"})
        }else{
            console.log("Couldnot delete, Sorry!")
            return res.status(500).json(error);
        }
    })
})

module.exports = router;
