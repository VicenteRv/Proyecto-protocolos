const mongoose = require("mongoose");
const { urlMongo } = require("../config/config");
const dbConnection = async() => {
    try {
        await mongoose.connect(urlMongo);
        console.log('Base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error el la hora de iniciar la bd');
    }
}

module.exports = { 
    dbConnection
}

