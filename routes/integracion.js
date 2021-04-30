var express = require('express')
var app = express()
var request = require('request')
const https = require('https')
const { promises } = require('fs')

var responseService = []

app.post('/:cantidadRecogidas',(req,res)=>{
    let total = req.params.cantidadRecogidas
    let body = req.body

    let contador = 0
    let recogidaId = []
    let promesatest = []
    while(contador<=total){
        recogidaId.push('http://localhost/CO.Recogidas.WebApi/api/Recogidas/InsertarRecogidaEsporadica')
        promesatest.push(postRecogida())
        contador ++
    }

    // promiseall(recogidaId).then((response=>{
    //    res.status(200).json({
    //        data : response
    //    }) 
    // }))

    postRecogidaall(promesatest).then((response)=>{
        res.status(200).json({
            data : response
        }) 
    }).catch((err)=>{
        res.status(500).json({
            error : err
        }) 
    })


})

function postRecogidaall(values){
    return Promise.all(values)
}

//172.16.135.11
function postRecogida(){
    return new Promise((resolve,reject)=>{
        request.post('http://localhost/CO.Recogidas.WebApi/api/Recogidas/InsertarRecogidaEsporadica',
            {headers : {'Content-Type': 'application/json',"usuario":"admin" } , body : JSON.stringify(bodyrecogida)}  
            ,(error,response,body)=>{
                if(error){
                    reject(error)
                }
                responseService.push(body)
                resolve(body)
            }
        )
    })
}

app.use('/cancelar/:inicio/:fin',(req,res)=>{
    let inicio = req.params.inicio
    let fin = req.params.fin
    let promesacancelar = []
    let promesacancelarccon = []

    while(inicio<=fin){

        var body =  {
            "IdActor":1,
            "IdMotivo":1,
            "IdSolicitudRecogida":inicio,
            "LocalidadCambio":11001000,
            "Solicitud":{
                "IdSolicitudRecogida":inicio,
                "LocalidadCambio":11001000,
                "DocPersonaResponsable" : "11221905",
                "Longitud":"",
                "Latitud":"",
                "IdCiudad":"11001000"
            }
        }

        promesacancelar.push(cancelarpromise(body))
        promesacancelarccon.push(body)
        inicio++
    }

    // res.status(200).json({
    //     promesacancelarccon,
    //     inicio
    // }) 

    Promise.all(promesacancelar).then(result=>{
        res.status(200).json({
            data : result,
            promesacancelarccon
        }) 
    }).catch(error=>{
        res.status(500).json({
            error
        }) 
    })

})

function cancelarpromise(reecogidabody){

    return new Promise((resolve,reject)=>{
        request.post('http://localhost/CO.Recogidas.WebApi/api/Recogidas/CancelarConMotivoSolRecogida',
        { headers : {'Content-Type': 'application/json',"usuario":"admin" } , body : JSON.stringify(reecogidabody) 
    },(error,response,body)=>{
            if(error){
                reject(response)
            }
            resolve(body)
        }
        )
    })
}


function promiseall (urls){
    return Promise.all(urls.map((url , i)=>{
        return new Promise((resolve,reject)=>{
            request.post(url,
                {headers : {'Content-Type': 'application/json',"usuario":"admin" } , body : JSON.stringify(bodyrecogida)}  
                ,(error,response,body)=>{
                    if(error){
                        reject(error)
                    }
                    responseService.push(body)
                    resolve(body)
                }
            )
        })
    }) )
}


var bodyrecogida = {
	"NumeroDocumento":"1118843805",
	"Nombre":"Nombre ",
	"Direccion":"calle 52 14",
	"Ciudad":"11001000",
	"NombreCiudad":"Bogota",
	"NumeroTelefono":"1118843805",
	"FechaRecogida":"2021-02-16T10:00:28.938Z",
	"TipoRecogida":2,
	"NombreLocalidad":"fff",
	"Longitud":"4545",
	"Latitud":"-54545",
	"TipoDocumento":"CC",
	"NombreCompleto":"nombrecompleto",
	"Correo":"",
	"PreguntarPor":"HUmmmm",
	"DescripcionEnvios":"oooo",
    "NoAsociarPreenvio":true,
    "TotalPiezas" : 2,
    "PesoAproximado" : 15,
    "ValorPropinaPreEnvio" : 2200
}


module.exports = app
