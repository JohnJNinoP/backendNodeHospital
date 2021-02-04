var express = require('express')
var app  = express()
var autentication = require('../middlewares/autentication')

var medicoModel = require('../models/medico')

//===============================================
//Obtener todos los medicos
//===============================================
app.get('/',(req,res)=>{
    medicoModel.find({}).exec((err,medicos)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error: err
            })
        }   

        res.status(200).json({
            ok:true,
            medicos
        })
    })
})

//===============================================
//Insertar un medico
//===============================================
app.post('/',autentication.verificaToken,(req,res)=>{
    let body = req.body 
    let id = req.usuario._id

    let medico = new medicoModel({
        name: body.name,
        img : body.img,
        usuario : id,
        hospital : body.hospital
    })

    medico.save((err,value)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error: err
            })
        }   

        res.status(200).json({
            ok:true,
            id : value._id
        })
    })

})


//===============================================
//Actualizar medico 
//===============================================

app.put('/:id',autentication.verificaToken,(req,res)=>{
    let body = req.body
    let id = req.params.id

    medicoModel.findById(id,(err,medico)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error: err
            })
        }   

        if(!medico){
            return res.status(204).json()
        }

        medico.name = body.name

        medico.save((err,value)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    message : "Error",
                    error: err
                })
            }   
            
            res.status(200).json({
                ok:true,
            })
        })
        
    })
})

//===============================================
//Eliminar
//===============================================

app.delete('/:id',autentication.verificaToken,(req,res)=>{
    let id = req.params.id

    medicoModel.findByIdAndRemove(id,(err,value)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error: err
            })
        }
        
        res.status(200).json({
            ok:true,
        })
    })

})

module.exports = app;