const express = require('express');
const cors = require ('cors');
const app = express();

app.use(cors());


app.get("/",(req, res)=>{
   res.send("API suma verificado"); 
});

app.get("/sumar/:n1/:n2",(req,res)=>{

    let n1 = req.params.n1;
    let n2 = req.params.n2;
    let resultado = suma(n1,n2);
    res.send(resultado);
});

function suma(n1, n2){
    let numero1 = parseInt(n1, 10);
    let numero2 = parseInt(n2, 10);    
    let resultado;
    if(numero1 && numero2){
        let suma = numero1 + numero2;
        resultado = {
            numero1: numero1,
            numero2: numero2,
            resul: suma
        };
    }else{
        resultado = {error: "Error solo debe introoducir numeros"}
    }

    
    return resultado;
}

const port = process.env.port || 80;
app.listen(port, ()=>console.log(`Escuchando en el puerto ${port}...`));