var express = require('express')
var app  = express()

var fs = require('fs')
const fileUpload = require('express-fileupload');


var middleware = require('../middlewares/autentication')

var medicoNodel = require('../models/medico')
var hospitalNodel = require('../models/hospital')
var usuarioNodel = require('../models/usuario')

var  pathimg = require('../config').PATH;

//===================================================
// middleware 
// Inicializa el fileUpload
//===================================================
app.use(fileUpload());


//===================================================
// Cargar archivo
//===================================================
app.put('/:tipo/:id'  ,(req,res)=>{

    if (!req.files || Object.keys(req.files).length === 0) {
        return resError(res,'No files were uploaded.',{})
    }

    let file = req.files.file
    let nameshort = file.name.split('.')
    
    let ext = nameshort[nameshort.length-1]
    let tipo = req.params.tipo
    let id = req.params.id

    let extvalid = ['png','jpg','gif','jpeg','PNG']

    let tipos  = ['medicos','hospitales','usuarios']

    if(tipos.indexOf(tipo) <0){
        return resError(res,'Tipo no valido.',{})
    }

    if(extvalid.indexOf(ext)<0){
        return resError(res,'Extencion no valida.',{})
    }

    let nameFile = `${id}${new Date().getMilliseconds()}.${ext}`
    let filepath = `${pathimg}/${tipo}/${nameFile}` 

    file.mv(filepath, (err)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                message : "Error",
                error : err
            })
        }

        subirPorTipo(tipo,id,nameFile,res)

    })
})


function subirPorTipo(tipo, id,nameFile,res){

    switch(tipo){
        case 'medicos':
            
            medicoNodel.findById(id).exec((err,value)=>{
                if (err){
                    return res.status(500).json({
                        ok:false,
                        message : "Error",
                        error : err
                    })
                }

                if(!value){
                    return res.status(204).json()
                }

                let img = value.img
                let pathOld = `${pathimg}/${tipo}/${img}`
                let existe = false; 
                if(fs.existsSync(pathOld)) {
                    existe = true
                    fs.unlink(pathOld,(err)=>{

                    })
                }

                value.img = nameFile

                value.save((err)=> {

                    if (err){
                        return res.status(500).json({
                            ok:false,
                            message : "Error",
                            error : err
                        })
                    }

                    return res.status(200).json({
                        ok:true,
                        img : value.img
                    })
    
                })                
            })
            break;
        case 'hospitales':
            hospitalNodel.findById(id).exec((err,value)=>{
                if (err){
                    return res.status(500).json({
                        ok:false,
                        message : "Error",
                        error : err
                    })
                }

                if(!value){
                    return res.status(204).json()
                }

                let img = value.img
                let pathOld = `${pathimg}/${tipo}/${img}`
                let existe = false; 
                if(fs.existsSync(pathOld)) {
                    existe = true
                    fs.unlink(pathOld,(err)=>{

                    })
                }

                value.img = nameFile

                value.save((err,value)=> {

                    if (err){
                        return res.status(500).json({
                            ok:false,
                            message : "Error",
                            error : err
                        })
                    }

                    return res.status(200).json({
                        ok:true,
                        img : value.img
                    })
    
                })                
            })
            break;

        case 'usuarios':
            usuarioNodel.findById(id).exec((err,value)=>{
                if (err){
                    return res.status(500).json({
                        ok:false,
                        message : "Error",
                        error : err
                    })
                }

                if(!value){
                    return res.status(204).json()
                }

                let img = value.img
                let pathOld = `${pathimg}/${tipo}/${img}`
                let existe = false; 
                if(fs.existsSync(pathOld)) {
                    existe = true
                    fs.unlink(pathOld,(err)=>{

                    })
                }

                value.img = nameFile

                value.save((err,value)=> {

                    if (err){
                        return res.status(500).json({
                            ok:false,
                            message : "Error",
                            error : err
                        })
                    }

                    return res.status(200).json({
                        ok:true,
                        img : value.img
                    })
                })                
            })
            break;
            
    }

}

function resError(res,message,error){
    res.status(400).json({
        ok:false,
        message : message,
        error : error
    })
}


module.exports = app