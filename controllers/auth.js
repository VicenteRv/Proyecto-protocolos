const { request, response } = require("express");

const login = async(req = request, res = response) => {
    res.json({
        msg: 'controlador POST - login'
    })
}

module.exports = {
    login
};
