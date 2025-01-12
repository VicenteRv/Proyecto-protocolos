const jwt = require('jsonwebtoken');
const { jwtSPK } = require('../config/config');

const generarJWT = (uid = '')=>{
    return new Promise((resolve,reject)=>{
        const payload = {uid};
        jwt.sign(payload,jwtSPK,{
            expiresIn: '2d'
        },(err,token)=>{
            if(err){
                console.log(err);
                reject('No se pudeo generar el token')
            }else{
                resolve(token);
            }
        });
    })
}

module.exports = {
    generarJWT
};