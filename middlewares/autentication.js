var jwt = require('jsonwebtoken')
var  seed = require('../config').SEED

//===========================================
//Verificar token middeware
//===========================================

exports.verificaToken = function(req,res,next){

    var token = req.query.token;
    
    jwt.verify(token,seed,(err,decoded) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                menssage : "Token no valido",
                error:err
            })
        }

        // res.status(200).json({
        //     ok:true,
        //     decoded:decoded
        // });

        req.usuario = decoded.usuario
        next();
    })
}



    

