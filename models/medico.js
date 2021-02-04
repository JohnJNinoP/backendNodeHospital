var mongoose = require("mongoose")

var Schema = mongoose.Schema

var medico = new Schema({
    name : {type : String ,required:[true,"El nombre es obligatorio"]},
    img : {type : String, required:false},
    usuario : {type : Schema.Types.ObjectId,ref : "Usuario", required:true},
    hospital: {type : Schema.Types.ObjectId, ref :"Hospital",required:[true,"El hospital es obligatorio"]}
})

module.exports = mongoose.model('Medico',medico)