var express = require('express')
var app  = express()


var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var  seed = require('../config').SEED


var usuarioModel = require('../models/usuario');

app.post('/', (req,res)=>{
    let body = req.body

    usuarioModel.findOne({ email : body.email },'name role password').exec((err,user)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message:"Error",
                error: err
            })
        }

        if(!user){
            return res.status(400).json({
                ok:false,
                message : "Credenciales invalidas"
            })
        }

        if(!bcrypt.compareSync(body.password,user.password)){
            return res.status(400).json({
                ok:false,
                message : "Credenciales invalidas"
            })
        }

        user.password = ""
        var token = jwt.sign({ usuario : user },seed,{ expiresIn : 14400 } )

        res.status(200).json({
            ok:true,
            data : user,
            token:token
        })
    })

    

})


module.exports = app;