// Requares
const express = require('express')
const mongoose = require('mongoose')

//Inicializar variables
const app = express()
const port = 3000

//Coneccion db

//Importar rutas 


// Import body-parse
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


var appRoutes = require("./routes/app")
var appUsuario = require("./routes/usuarioRoute")

mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',(err,res) => {
    if(err) throw err
    
    console.log("Mongo server run in port 27017 : \x1b[32m%s\x1b[0m ",'online')
 })

app.use('/usuario', appUsuario)
app.use('/', appRoutes)

// Escuchar peticiones 
app.listen(port, () => {
    console.log("Express server run in port 3000  : \x1b[32m%s\x1b[0m ",'online')
})



//note 
//npm install --save-dev nodemon 
//npm start