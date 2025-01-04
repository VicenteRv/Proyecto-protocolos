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
    }
    middlewares() {
        // CORS
        this.app.use( cors() );
        // Directorio Público
        this.app.use( express.static('public') );
    }
    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }
}

module.exports = Server;