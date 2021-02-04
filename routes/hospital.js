var express = require('express')
var app  = express()
var autentication = require('../middlewares/autentication')

var hospitalModel = require('../models/hospital')



// app.use('/', autentication.verificaToken ,(req,res,next)=>{

//     let rol= req.usuario.role
    
//     if (rol !=='ADMIN'){
//         res.status(401).json({
//             ok:false,
//             message : "No tiene permisos"
//         })
//     }
//     //next();
// })

//===========================================
// Obtener todos los hospitales
//===========================================
app.get('/' ,(req,res)=>{

    hospitalModel.find({}).exec(
        (err,hospitales)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message:"Contacta a soporte tecnico",
                    error : err
                })
            }
            res.status(200).json({
                ok:true,
                hospitales
            })
        }
    )    
})

//===========================================
// Obtener hopital por su identificador
//===========================================

app.get('/:id',(req,res)=>{
    let id = req.params.id
    hospitalModel.findById(id,'name').exec((err,hospital)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message:"Contacta a soporte tecnico",
                error : err
            })
        }

        if(!hospital){
            return res.status(204).json()
        }

        res.status(200).json({
            ok:true,
            hospital
        })
    })
})

app.post('/',autentication.verificaToken,(req,res)=>{
    let body = req.body
    let idUsuario = req.usuario._id

    let hospital = new hospitalModel({
        name : body.name,
        img : body.img,
        usuario : idUsuario
    })

    hospital.save((err,hospital)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error: err
            })
        }

        res.status(200).json({
            ok:true,
            id : hospital._id
        })
    })
})

app.put('/:id', autentication.verificaToken ,(req,res)=>{

    let id = req.params.id
    let body = req.body

    hospitalModel.findById(id,(err,hospital)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error: err
            })
        }

        if(!hospital){
            return res.status(204).json({
            })
        }

        hospital.name = body.name

        hospital.save((err)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message : "Error",
                    error: err
                })
            }

            res.status(200).json({
                ok:true
            })
        })
    })
})

app.delete('/:id',autentication.verificaToken,(req,res)=>{
    let id = req.params.id

    hospitalModel.findByIdAndRemove(id,(err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error: err
            })
        }

        res.status(200).json({
            ok:true
        })

    })
})

module.exports = app