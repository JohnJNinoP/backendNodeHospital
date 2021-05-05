var express = require('express')

var app  = express()

//model 

var hospitalModel = require('../models/hospital')
var medicosModel = require('../models/medico')
var usuariosModel = require('../models/usuario')


//===================================================
// Busqueda general 
//===================================================
app.get('/todo/:busqueda',(req,res)=>{
    let valores = req.params.busqueda

    var valueRegex = new RegExp(valores , 'i')


    Promise.all([
        buscarHospitales(valueRegex),
        buscarMedico(valueRegex),
        buscarUsuario(valueRegex)
    ]
        ).then(values =>{
        res.status(200).json({
            ok:true,
            hospitales : values[0],
            medicos : values[1],
            usuarios : values[2]
        })    
    })
        
})


app.get('/collection/:tabla/:busqueda',(req,res)=>{
    let busqueda = req.params.busqueda
    let tabla = req.params.tabla

    var valueRegex = new RegExp(busqueda , 'i')

    let returnvalue = (res,values,tabla)=>{
        res.status(200).json({
            ok:true,
            [tabla] : values
        })
    }

    let returnvalueError = (res,values)=>{
        res.status(400).json({
            ok:false,
            error : values
        })
    }
    
    switch(tabla){
        case 'medicos':
            buscarMedico(valueRegex).then(value =>{
                returnvalue(res,value,tabla)
            }).catch((err)=>{
                returnvalueError(res,err)
            })
            break;

        case 'hospitales':
            buscarHospitales(valueRegex).then(value =>{
                returnvalue(res,value,tabla)
            })
            break
        case 'usuarios':
            buscarUsuario(valueRegex).then(value =>{
                returnvalue(res,value,tabla)
            })
            break            
        default :
            returnvalueError(res,{message : "collection invalid"})
    }
})

function buscarHospitales(valueRegex){

    return new Promise((resolve,reject)=>{
        hospitalModel.find({name: {  $regex : valueRegex}},'name ').exec((err,values)=>{
            if(err){
                reject("Error al cargar hospitales" , err)
            }else {
                resolve(values)
            }
        })
    })
}

function buscarMedico(valueRegex){

    return new Promise((resolve,reject)=>{
        medicosModel.find({name: {  $regex : valueRegex} },'name img' )
        .populate('hospital')
        .exec((err,values)=>{
            if(err){
                reject("Error al cargar medicos" , err)
            }else {
                resolve(values)
            }
        })
    })
}

function buscarUsuario(valueRegex){

    return new Promise((resolve,reject)=>{
        usuariosModel.find({},'name email role')
        .or([{name: {  $regex : valueRegex} } ,{ email: { $regex : valueRegex } }])  // valida dos columnas 
        .exec((err,values)=>{
            if(err){
                reject("Error al cargar usuarios" , err)
            }else {
                resolve(values)
            }
        })
    })
}

module.exports = app