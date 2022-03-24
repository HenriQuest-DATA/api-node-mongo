const Customer = require('../models/customers');
const md5 = require('md5');
const authService = require('../services/auth');

module.exports = app => {
    app.post('/customers/login', async (requisicao, resposta, next) => {    
        try{
            const customer = await authService.authenticate({
                email: requisicao.body.email,
                password: md5(requisicao.body.password + global.MD5_HASH)
            });

            // if(!customer){
            //     res.status(401).send({
            //         message: 'Invalido'
            //     })
            //     return;
            // }

            const token = await authService.generateToken({ 
                id: customer._id,
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            });

            resposta.status(201).send({
                token: token,
                message: 'Logado com sucesso!'
            })
            
        } catch(e){
            resposta.status(401).send({
                message: 'Acesso negado.',
                error: e.message
            })
        }
    })
}