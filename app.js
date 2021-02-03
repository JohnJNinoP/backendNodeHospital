// Requares
const express = require('express')
const mongoose = require('mongoose')

//Inicializar variables
const app = express()
const port = 3000

//Coneccion db

mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',(err,res) => {
    if(err) throw err
    
    console.log("Mongo server run in port 27017 : \x1b[32m%s\x1b[0m ",'online')
 })

// Escuchar peticiones 
app.listen(port, () => {
    console.log("Express server run in port 3000  : \x1b[32m%s\x1b[0m ",'online')
})

app.get('/', (req, res, next) => {
    //console.log(req)
    res.status(200).json(
        {
            ok: true,
            mensaje:"Peticion realizada correctamente",
            body : req.body
        }
    )
    //res.send('Hello World!')
})


//note 
//npm install --save-dev nodemon 