const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');  // Importa cookie-parser
const fileUpload = require('express-fileupload');
const { port } = require('../config/config');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();  
        this.port = port;
        this.paths = {
            usuarios:   '/api/usuarios',
            auth:       '/api/auth',
            protocolos: '/api/protocolos',
        }
        //Conectar a BD
        this.conectarDB();
        // Middlewares
        this.middlewares();
        // rutas de la aplicacion
        this.routes();
    }
    async conectarDB(){
        await dbConnection();
    }
    middlewares() {
        // CORS
        this.app.use( cors() );
        //lectura y parse del body 
        this.app.use(express.json());
        // Configuración de cookie-parser
        this.app.use(cookieParser());
        // Directorio Público
        this.app.use( express.static('public') );
        //FileUpload - cargar de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }
    routes() {
        this.app.use(this.paths.usuarios,require('../routes/usuario'));
        this.app.use(this.paths.auth,require('../routes/auth'));
        this.app.use(this.paths.protocolos,require('../routes/protocolo'));

    }
    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports = Server;