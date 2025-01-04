const express = require('express');
const cors = require('cors');
const { port } = require('../config/config');

class Server {

    constructor() {
        this.app  = express();  
        this.port = port;
        this.paths = {
            usuarios:   '/api/usuarios',
        }
        // Middlewares
        this.middlewares();
        // rutas de la aplicacion
        this.routes();
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

    }
    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports = Server;