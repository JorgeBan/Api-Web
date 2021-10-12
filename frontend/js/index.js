const URL_API = "http://127.0.0.1"
const sumar = ()=>{
    let n1 = parseInt(document.getElementById("n1").value,10);
    let n2 = parseInt(document.getElementById("n2").value,10);
    document.getElementById('n1').style.borderColor = null;
    document.getElementById('n2').style.borderColor = null;
    document.getElementById('result').value = null;

    if(n1 && n2){
        fetch(`${URL_API}/sumar/${n1}/${n2}`)
        .then(response => response.json()
        .then(data => {
            console.log(data)
            document.getElementById('result').value = data.resul;
        }));
    }else{
        if(!n1){
            document.getElementById('n1').style.borderColor = "red";
        }
        if(!n2){
            document.getElementById('n2').style.borderColor = "red";
        }
    }

        
}
