const express= require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//checkrole is used when we want only admin to have its access
router.get('/get', auth.authenticateToken, (req, res, next)=>{
    var query = `SELECT * FROM Category`;// ORDER BY name`; 
    connection.query(query, (error, results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error);
        }
    });
});

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next)=>{
    let category = req.body;
    query =`INSERT INTO Category (name) VALUES(?)`;
    connection.query(query, [category.name], (error,results)=>{
        if(!error){
            return res.status(200).json({messgae: "Category added successfully"});
        }else{
            return res.status(500).json(error, {message:"Something went wrong"});
        }
    });
});

router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req,res,next)=>{
    let product = req.body;
    var query = `UPDATE Category SET name=? WHERE id=?`;
    connection.query(query, [product.name, product.id], (error, results)=>{
        if(!error){
            if(results.affectedRows ==0){
                return res.status(404).json({message:"No such category found"})
            }
            return res.status(200).json({messgae:"Category updated succesfully"});
        }else{
            return res.status(500).json(error);
        }
    });
});

module.exports = router;