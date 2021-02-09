var mongoose = require("mongoose")
var uniqueValidator = require('mongoose-unique-validator');

var rolesValidos = {
    values : ['ADMIN','USER'],
    message : 'El rol {VALUE} no es un rol valido'
 }

var Schema = mongoose.Schema

var usuarioSchema = new Schema({ 
    name : { type : String, required: [true,"El nombre es necesario"]} , 
    email : { type : String, unique:true , required : [true,"El correo es necesario."]} , 
    password : { type : String, required : [true,"La contraseña es necesaria"]} ,
    img : { type : String },
    role : { type : String , required : [true,"El rol es requerido"] , enum: rolesValidos},
    google : { type: Boolean , default: false}
});

usuarioSchema.plugin(uniqueValidator,{message : "El {PATH} debe ser unico"})

module.exports = mongoose.model('Usuario',usuarioSchema);