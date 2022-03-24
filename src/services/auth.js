const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customers');

exports.generateToken = async (data) => {
    console.log(data)
;    return jwt.sign(data, global.MD5_HASH, { expiresIn: '1d' })
}

exports.decodeToken = async (token) => {
    var data = await jwt.verify(token, global.MD5_HASH);
    return data;
}

exports.authorize = (requisicao, resposta, next) => {
    var token = requisicao.body.token || requisicao.query.token || requisicao.headers['x-access-token'];

    if(!token){
        resposta.status(401).json({
            message: 'Acesso restrito'
        });
    } else{
        jwt.verify(token, global.MD5_HASH, function(error, decoded){
            if(error){
                resposta.status(401).json({
                    message: 'Token inválido'
                });
            } else{
                next();
            }
        });
    }
}

exports.authorizeADM = async (requisicao, resposta, next) => {
    var token = requisicao.body.token || requisicao.query.token || requisicao.headers['x-access-token'];
    var data = await jwt.verify(token, global.MD5_HASH);

    if(!token){
        resposta.status(401).json({
            message: 'Acesso restrito'
        });
    } else if(data.roles.includes('admin')){
        next();
    } else{
        resposta.status(401).json({
            message: 'Acesso restrito'
        });
    }
}

exports.authenticate = async (data) => {
    const red = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return red;
}

exports.refreshToken = async (data) => {
    const red = await Customer.findById(data._id);
    return red;
}