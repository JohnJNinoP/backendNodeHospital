var express = require('express')
var bcrypt = require('bcryptjs');

const app = express()

var usuarioModel = require('../models/usuario')

var autentication = require('../middlewares/autentication')

//===========================================
//Obtener todos los usuarios
//===========================================
app.get('/', (req, res, next) => {

    var desde  = req.query.desde || 0
    desde = Number(desde)

    usuarioModel.find({  }, 'name email img rol')
    .skip(desde)   // Obtiene un paginado desde 
    .limit(5)      // Limita la consulta a n registros
    .exec( (err, usuarios )=>{
        if(err) {
            return res.status(500).json(
                {
                    ok: true,
                    mensaje:"Error consultando mongoDB",
                    error : err
                }
            )
        }

        usuarioModel.count({},(err, count)=>{

            if(err) {
                return res.status(500).json(
                    {
                        ok: true,
                        mensaje:"Error consultando mongoDB",
                        error : err
                    }
                )
            }

            res.status(200).json(
                {
                    ok: true,
                    usuarios : usuarios,
                    total : count
                }
            )
        })
    })  
})

//===========================================
// Obtener usuarios por nombre
//===========================================
app.get('/:name' , function(req,res) {
    let name =   req.params.name

    usuarioModel.find({ name : name }).exec( (err,usuario) => {
        res.status(200).json({
            usuario
        })    
    } )
})



//===========================================
//Insertar usuario
//===========================================
app.post('/', autentication.verificaToken , (req,res) => {
    
    let body = req.body

    let usuario = new usuarioModel({
        name : body.name,
        email : body.email,
        password : bcrypt.hashSync(body.password,10),
        img : body.img,
        role : body.role
    })

    usuario.save((err,response) => {
        if(err){
            return res.status(400).json({
                ok:false,
                mensaje : "Error",
                error : err
            })
        }

        res.status(201).json({
            ok:true,
            id : response._id
        })
    })
})


//===========================================
//Actualizar usuario
//===========================================
app.put('/:id', autentication.verificaToken , (req,res)=>{

    let id =  req.params.id
    let body = req.body

    usuarioModel.findById(id,'name email role').exec((err,user)=>{
        if(err) {
            return res.status(500).json({
                ok:false,
                menssage : "Error",
                errro:err
            })
        }
        if(!user){
            res.status(400).json({
                ok:false,
                menssage : "El usuario no existe",
                errro : null
            })
        }else{

            user.name = body.name;
            user.email = body.email
            user.role = body.role

            user.save((err)=>{
                if(err){
                    return res.status(400).json({
                        ok:false,
                        menssage : "Error actualizando usuario",
                        error : err
                    })
                }
                res.status(200).json({
                    ok:true
                })
            })   
        }
    })
})

//===========================================
// Eliminar usuario
//===========================================
app.delete('/:id',autentication.verificaToken,(req,res)=>{
    let id = req.params.id

    usuarioModel.findByIdAndDelete(id).exec((err,user)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                menssage:"Error eliminaod usuario",
                error: err
            })
        }
        if(!user){
            return res.status(204).json({})
        }

        res.status(200).json({
            ok:true,
        })
    })
})



module.exports = app;
