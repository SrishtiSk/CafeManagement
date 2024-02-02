const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


router.post('/signup', (request, res)=>{
    let user = request.body;
    query = "select email, password, role, status from user where email=?";
    connection.query(query, [user.email], (err,results)=>{
        if(err){ 
            return res.status(500).json({message:"idiot error"});
        }else{
            if(results.length <= 0){
                console.log("result.length:", results.length);
                query =  `INSERT INTO user (name, contactNumber, email, password, status, role)
                VALUES(?, ?,?,? ,'false','user')`;
                connection.query(query,[user.name, user.contactNumber, user.email, user.password], (err, results)=>{
                    if(!err){
                        return res.status(200).json({message: "Sucessfully Registered"});
                    }
                    else{
                        return res.status(500).json({message:"Failed to register."});
                    }
                });
            }else{
                return res.status(200).json({message:"Email already exist."});
            }
        }
    });
});

router.post('/login',(req, res)=>{
    const user = req.body;
    query = `SELECT email, password, role, status FROM user WHERE email=?`;
    connection.query(query, [user.email], (err, results)=>{
        if(!err){
            //login id is incorrect
            if(results.length <=0 || results[0].password != user.password){
                return res.status(400).json({message: "Incorrect username or password"});
            }
            else if(results[0].status === 'false'){
                return res.status(401).json({message: "Wait for admin approval."});
            }
            else if(results[0].password == user.password){
                const response = { email : results[0].email, role: results[0].role };
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: '2h'} );
                res.status(200).json({ token: accessToken});
            }
            else{
                return res.status(400).json({message:"Something went wrong! Please try again later."})
            }
        }else{
            return res.status(500).json(err);
        }
    });
});

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

router.post('/forgotPassord', (request, response)=>{
    const user = req.body;
    query = "SELECT email, password FROM user WHERE email=?;"

    connection.query(query, [user.email], (err, results)=>{
        if(!err){
            if(results.length<=0){ //user dosnt exsit
                return res.status(200).json({message: "User dosnt not exsist"})
            }
            else{
                var mailOptions ={
                    from: process.env.EMAIL,//'Cafe Email', 
                    to: results[0].email,
                    subject:"password by Cafe Management System",
                    html:`<p><b>Your login details for Dafe management System:</b></br>
                    <b>Email: </b> ${results[0].email} </br>
                    <b>Password: </b> ${results[0].password} </br>
                    <a href="http://localhost:4200/">Click here to login</a>
                    </p>`
                };
                transporter.sendMail(mailOptions, function(err, info){
                    if(err) {
                        console.log("Error Sending email", err);
                    }else{
                        console.log("Email sent:", info.response)
                    }
                });
                console.log("Email SENT! :)");
                return res.status(200).json({message : 'An Email has been send to your registered Email Id'});
            }
        }else{
            return res.status(200).json({message: "User dosnt not exsist"})
        }
    });
});

//change password
router.post('/changePassword',auth.authenticateToken, (req, res)=>{
    const user = req.body;
    const email = res.locals.email;
    var query = `select * from user where email=? and password=?`;
    connection.query(query, [email, user.oldPassword], (error, results)=>{
        if(!error){
            if(results.length <=0){
              return res.status(400).json({message: 'Incorrect Old Pasword'});
            }else if(results[0].password = user.oldPassword){
                query = `Update user set password=? where email=?`;
                connection.query(query,[user.newPassword, email], (err, result)=>{
                    if(!err){
                        return res.status(200).json({message:"Password updated Successfully"})
                    }else{
                        return res.status(500).json(err);
                    }
                });
            }else{
                return res.status(400).json({message: "Something went wrong, Please try again later!"});
            } 
        }else{
            return res.status(500).json(error);
        }
    })
});

//get all users (only accessable to admin)
router.get('/get', auth.authenticateToken, checkRole.checkRole, (req,res)=>{ 
    var query = `SELECT id, name, email, contactNumber, status FROM user WHERE role="user"`;
    connection.query(query, (error, results)=>{
        if(!error){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(error, {message:"Couldnot fetch Userlist, Sorry mate!"})
        }
    });
});

//patch- update user
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    let user = req.body;
    var query = `update user set status=? where id=?`;
    connection.query(query, [user.status, user.id], (err, results)=>{
        if(err)
            return res.status(500).json(err);
        else{
            if(results.affectedRows ==0){ //No user found
                return res.status(404).json({message : 'No user id found'});
            }
            return res.status(200).json({message: "user updated Sucessfully"});
        }
    });
});

router.get('/checkToken', auth.authenticateToken, (req, res)=>{
    return res.status(200).json({message: "true"});
});

module.exports = router;