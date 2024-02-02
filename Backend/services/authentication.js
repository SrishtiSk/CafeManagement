require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){ //autherization token dosent exists
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (error, response)=>{
        if(error)
            return res.sendStatus(403);//.json({message: 'jwt token error'});
        res.locals = response;
        next();
    })
}

module.exports = { authenticateToken: authenticateToken }