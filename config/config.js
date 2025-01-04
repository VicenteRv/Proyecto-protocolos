// require('dotenv').config();  // Asegúrate de que esto esté al inicio del archivo

module.exports = {
   port: process.env.PORT || 8080,
   urlMongo: process.env.MONGODB_CNN,
};