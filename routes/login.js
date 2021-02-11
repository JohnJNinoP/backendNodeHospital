var express = require('express')
var app  = express()


var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var  seed = require('../config').SEED
var CLIENT_ID = require('../config').CLIENT_ID
 

// google sing in 
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


var usuarioModel = require('../models/usuario');
const usuario = require('../models/usuario');
const { use } = require('./usuarioRoute');

//========================================================
// login internal 
//========================================================
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


//========================================================
// login google
//========================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    // if(!ticket){
        
    // }

    const payload = ticket.getPayload();
    //const userid = payload['sub'];

    //return payload;
    
    return {
        name : payload.name,
        email : payload.email,
        img : payload.picture
    }
}

app.post('/googlesingin' , async(req,res)=>{
    let body = req.body
    
    var googleUser = await verify(body.token)
    .catch(()=>{
        return res.status(403).json({
            ok:false,
            message : "Token no valido"
        })
    })

    usuarioModel.findOne({ email:googleUser.email }, 'name email role').exec((err,value)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error : err
            })
        }

        if (value){
            if(value.google === false){
                return res.status(400).json({
                    ok:false,
                    message : "Debe autenticar por contraseña"
                })
            }else {
                var token = jwt.sign({ usuario : value },seed,{ expiresIn : 14400 } )
                res.status(200).json({
                    ok:true,
                    data : value,
                    token
                })
            }
        }else{
            //el usuaro no existe hay que crearlo
            usuariom = new usuarioModel({
               name : googleUser.name,
               email : googleUser.email,
               password : bcrypt.hashSync("::",10) ,
               google : true,
               role : "USER"
            });
        
            usuariom.save((err,user)=>{

                if(err){
                    return res.status(400).json({
                        ok:false,
                        message : "error",
                        error: err
                    })
                }

                userToken = {
                    _id : user._id,
                    name : user.name,
                    email : user.email,
                    role : user.role
                }

                var token = jwt.sign({ usuario : userToken },seed,{ expiresIn : 14400 } )

                res.status(200).json({
                    ok:true,
                    data : userToken,
                    token
                })
            })
        }
    })

   

    //========================================================
    // Validar forma tradicional 
    //========================================================
    // verify(body.token)
    // .then((value) =>{
    //     res.status(200).json({
    //         ok:true,
    //         value
    //     })
    // })
    // .catch(()=>{
    //     res.status(403).json({
    //         ok:false
    //     })
    // })
})


module.exports = app;