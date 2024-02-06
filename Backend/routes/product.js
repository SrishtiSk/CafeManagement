const express = require('express');
const connection = require('../connection');
const router = express.Router();
const auth = require('../services/authentication');
const chaeckRole = require('../services/checkRole');
const checkRole = require('../services/checkRole');
const { errorMonitor } = require('nodemailer/lib/xoauth2');

//add products
router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    let product = req.body;
    var query = `INSERT INTO Product (name, categoryId, description, price, status) VALUES (?,?,?,?,'true')`;
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (error, result)=>{
        if(!error){
            return res.status(200).json({message:"Product added Successfully."});
        }else{
            return res.status(500).json(error, {message:"Sorry Couldn't add Product"});
        }
    })
});

router.get('/get', auth.authenticateToken, (req, res)=>{
    //var query =`SELECT * FROM Product`;
    var query = `SELECT p.id, p.name, p.description, p.price, p.status, c.id AS categoryId, c.name AS categoryName 
    FROM Product AS p INNER JOIN Category AS c WHERE p.categoryId = c.id`;
    connection.query(query, (error, results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error, {message:"Sorry, Couldn't GET Products!"});
        }
    })
});

//get all items from particular category
router.get('/getByCategory/:id', auth.authenticateToken, (req, res)=>{
    const id = req.params.id;
    var query = `SELECT id, name FROM Product WHERE categoryId=? AND status='true'`;
    connection.query(query, [id], (error, results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error);
        }
    })
});

//getby product id
router.get('/getById/:id', auth.authenticateToken, (req, res, next)=>{
    const id = req.params.id;
    var query=`SELECT id, name description, price FROM Product WHERE id=?`;
    connection.query(query, [id], (error, results)=>{
        if(!error){
            if(results.length <=0){
                return res.status(404).json({message:"No product with this Id exists"});
            }
            return res.status(200).json(results[0]);
            //[0] becaue we need only one
        }else{
            return res.status(500).json(error);
        }
    })
}); 


router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next)=>{
    let product = req.body;
    var query = `UPDATE Product SET name=?, categoryId=?, description=?, price=? WHERE id=?`;
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (error, results)=>{
        if(!error){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"Product id is not found"});
            }
            return res.status(200).json({message:"Product updated Sucessfully"});
        }else{
            return res.status(500).json(error);
        }
    })
}); 

router.delete('/delete/:id', auth.authenticateToken, chaeckRole.checkRole, (req, res, next)=>{
    const id = req.params.id;
    var query = `DELETE FROM Product WHERE id=?`;
    connection.query(query, [id], (error, results)=>{
        if(!error){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"Product id doesnt exist!"});
            }
            return res.status(200).json({message:"Product deleted succeffully!!"});
        }else{
            return res.status(500).json(error);
        }
    })
});

//to change statys
router.patch('/updateStatus', auth.authenticateToken, chaeckRole.checkRole, (req, res, next)=>{
    let user = req.body;
    var query = `UPDATE Product SET status=? WHERE id=?`;
    connection.query(query, [user.status, user.id], (error, results)=>{
        if(!error){
            if(results.affectedRows ==0){
                return res.status(404).json({message: 'The Product ID does not exist'});
            }
            return res.status(200).json({message:" Product 'status' Updated uccessfully"});
        }else{
            return res.status(500).json(error);
        }
    });
});

module.exports = router;