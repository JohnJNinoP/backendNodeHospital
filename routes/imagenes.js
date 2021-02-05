var express = require('express')
var app  = express()
var fs = require('fs')

var pathGlobalImg = require('../config').PATH

const path = require('path')

app.get('/:tipo/:img',(req,res)=>{

    var tipo = req.params.tipo
    var img  = req.params.img

    let pathImage = path.resolve(pathGlobalImg, `${tipo}/${img}` )
    let pathnoimage = `${__dirname}/assets/img/no-img.jpg`
    
    let existe = false
    if(fs.existsSync(pathImage)){
        res.sendFile(pathImage)
        existe= true
    }else {
        res.sendFile(pathnoimage)
    }
})

module.exports = app