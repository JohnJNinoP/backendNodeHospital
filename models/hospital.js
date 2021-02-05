var mongoose = require("mongoose")

var Schema = mongoose.Schema

var hospital = new Schema({
    name : {type : String ,required:[true,"El nombre es obligatorio"]},
    img : {type : String, required:false},
    usuario : {type: Schema.Types.ObjectId, ref : "Usuario"}
},{collection : 'hospitales'})

module.exports = mongoose.model('Hospital',hospital)