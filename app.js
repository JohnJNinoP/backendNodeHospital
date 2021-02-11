// Requares
const express = require('express')
const mongoose = require('mongoose')
var cors = require('cors')


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
var appLogin = require('./routes/login')
var appHospital = require('./routes/hospital')
var appMedico = require('./routes/medico')
var appBusqueda = require('./routes/busqueda')
var appUpload = require('./routes/upload')
var appImg = require('./routes/imagenes')

var corsOptions = {
    origin: 'http://localhost:4200',
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }


mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',(err,res) => {
    if(err) throw err
    
    console.log("Mongo server run in port 27017 : \x1b[32m%s\x1b[0m ",'online')
 })

app.use(cors(corsOptions))

app.use('/login',appLogin)
app.use('/usuario', appUsuario)
app.use('/hospital',appHospital)
app.use('/medico',appMedico)
app.use('/busqueda',appBusqueda)
app.use('/upload',appUpload)
app.use('/img',appImg)

app.use('/', appRoutes)

// Escuchar peticiones 
app.listen(port, () => {
    console.log("Express server run in port 3000  : \x1b[32m%s\x1b[0m ",'online')
})



//note 
//npm install --save-dev nodemon 
//npm start