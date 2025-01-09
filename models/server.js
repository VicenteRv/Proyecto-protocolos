const express = require('express');
const cors = require('cors');
const { port } = require('../config/config');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();  
        this.port = port;
        this.paths = {
            usuarios:   '/api/usuarios',
            auth:       '/api/auth',
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
        // Directorio Público
        this.app.use( express.static('public') );
    }
    routes() {
        this.app.use(this.paths.usuarios,require('../routes/usuarios'));
        this.app.use(this.paths.auth,require('../routes/auth'));

    }
    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports = Server;