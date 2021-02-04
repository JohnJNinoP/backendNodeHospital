const express = require('express')
const { model } = require('mongoose')

const app = express()


app.get('/', (req, res, next) => {
    res.status(200).json(
        {
            ok: true,
            mensaje:"Petición realizada correctamente",
            body : req.body
        }
    )
    //res.send('Hello World!')
})

module.exports = app;