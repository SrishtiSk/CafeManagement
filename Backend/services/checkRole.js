require('dotenv').config();

//this is used when a api is only for 'ADMIN' role
function checkRole(req,res,next){
    if(res.locals.role == process.env.USER)
        res.sendStatus(401);//.json({message: "Check role : USER"});
    else
        next()

}
module.exports = { checkRole: checkRole };