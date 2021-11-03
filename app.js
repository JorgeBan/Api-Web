const express = require('express');
const app = express();


app.use(express.urlencoded({extended:false}));
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config({path: "./env/.env"});

app.use("/resources", express.static('public'));
app.use("/resources", express.static(__dirname + '/frontend/public'));

console.log(__dirname)

app.set('views', __dirname + '/frontend/views');
app.set('view engine', 'ejs');

const bcryptjs = require("bcryptjs");

const session = require("express-session");
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))



const db_connection = require("./Database/db");
const connection = require('./Database/db');



app.get("/login", (req, res)=>{
    //res.render('Usuarios/login');
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('Usuarios/login');
	}
	res.end();
});


app.get("/register", (req, res)=>{
    if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('Usuarios/register');
	}
	res.end();
});

app.post("/register",  async (req, res)=>{
    const nombre = req.body.nombre;
    const genero = req.body.genero;
    const direccion = req.body.direccion;
    const email = req.body.email;
    const password = req.body.password;
    const rpass = req.body.rpass;
	const passcryto = await bcryptjs.hash(password, 8);
    
	if(rpass == password){

		connection.query("INSERT INTO usuario SET ?",{nombre: nombre, correo: email, contrasena: passcryto, direccion: direccion, genero:genero},
    	async(error, result)=>{
        if(error){
            res.render('Usuarios/register', {
				alert: true,
				alertTitle: "Error",
				alertMessage: error.code,
				alertIcon:'error',
				showConfirmButton: false,
				timer: 2500,
				ruta: 'register'
			});
        }else{
			req.session.loggedin = true;                
			req.session.name = nombre;
            res.render('Usuarios/register', {
					alert: true,
					alertTitle: "Registro",
					alertMessage: "¡Registro exitoso",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});
        	}
   	 	}
    	)
	}else{
		res.render('Usuarios/register', {
			alert: true,
			alertTitle: "Error",
			alertMessage: "Las contraseñas no coinciden",
			alertIcon:'error',
			showConfirmButton: false,
			timer: 1500,
			ruta: 'register'
		});
	}
});


app.post('/auth', async (req, res)=> {
	const email = req.body.email;
	const password = req.body.password;    
	if (email && password) {
		connection.query('SELECT * FROM usuario WHERE correo = ?', [email], async (error, results, fields)=> {
			if( results.length == 0 || !(await bcryptjs.compare(password, results[0].contrasena)) ) {    
				res.render('Usuarios/login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: 2500,
                        ruta: 'login'    
                    });
							
			} else {         
			    
				req.session.loggedin = true;                
				req.session.name = results[0].nombre;
				res.render('Usuarios/login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
		res.end();
	}
});


app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});

app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});

const port = process.env.port || 3000;
app.listen(port, (req, res)=>console.log(`Escuchando en el puerto ${port}...`));