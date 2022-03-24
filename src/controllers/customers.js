const Customer = require('../models/customers');
const validationContract = require('../validations/validations');
const md5 = require('md5');
const emailService = require('../services/email');
const authService = require('../services/auth');

module.exports = app => {
    app.get('/customers', (requisicao, resposta) => {
        Customer.find({}, "name email password")
            .then(dados => {
                resposta.status(200).send(dados);
            })
            .catch(erro => {
                resposta.satus(401).send(erro.message);
            });
    })

    app.get('/customers/:id', (requisicao, resposta) => {
        Customer.find({ _id:requisicao.params.id }, "name email password")
            .then(dados => {
                resposta.status(200).send(dados);
            })
            .catch(erro => {
                resposta.status(401).send(erro.message);
            });
    })

    app.post('/customers', async (requisicao, resposta, next) => {    
        const customer = new Customer({
            name: requisicao.body.name,
            email: requisicao.body.email,
            password: md5(requisicao.body.password + global.MD5_HASH),
            roles: ['user']
        });

        // emailService.send(
        //     requisicao.body.email, 
        //     'Bem vindo ao NODE', 
        //     global.EMAIL_TMPLT.replace('{0}', requisicao.body.name)
        // );
        emailService(
            requisicao.body.email, 
            'Bem vindo ao NODE', 
            global.EMAIL_TMPLT.replace('{0}', requisicao.body.name)
        );

        const contract = new validationContract();

        contract.hasMinLen(requisicao.body.name, 3, 'Nome inválido (.Min)');
        contract.hasMaxLen(requisicao.body.name, 40, 'Nome inválido (.Max)');
        contract.hasMinLen(requisicao.body.email, 'Email inválido (.Mail)');
        contract.hasMinLen(requisicao.body.password, 8, 'Senha inválido (.Min)');
        contract.hasMaxLen(requisicao.body.password, 30, 'Senha inválido (.Max)');
        contract.isSenha(requisicao.body.password, 'Senha inválido (.RegEx)');
        const errors = contract.errors();

        if(errors.length == 0){
            customer.save()
            .then(() => {
                resposta.status(200).send({ message: 'Cliente cadastrado com sucesso! :)' });
            })
            .catch(e => {
                resposta.status(400).send({ message: `Falha ao cadastrar :'(`, data: e });
            });
        } else{
            resposta.status(400).send(errors);
        }

        contract.clear();
    })

    app.post('/customers/refresh-token', async (requisicao, resposta, next) => {
        const token = requisicao.body.token || requisicao.query.token || requisicao.headers['x-access-token'];
        const tokenDecrypted = await authService.decodeToken(token);

        const newToken = await authService.generateToken({ 
            id: tokenDecrypted.id,
            email: tokenDecrypted.email,
            name: tokenDecrypted.name,
            roles: tokenDecrypted.roles
        });

        resposta.status(201).send({
            token: newToken,
            tokenDecrypted
        });
    })

    app.put('/customers/:id', (requisicao, resposta) => {
        const contract = new validationContract();

        contract.hasMinLen(requisicao.body.name, 3, 'Nome inválido (.Min)');
        contract.hasMaxLen(requisicao.body.name, 40, 'Nome inválido (.Max)');
        contract.hasMinLen(requisicao.body.email, 'Email inválido (.Mail)');
        contract.hasMinLen(requisicao.body.password, 8, 'Senha inválido (.Min)');
        contract.hasMaxLen(requisicao.body.password, 30, 'Senha inválido (.Max)');
        contract.isSenha(requisicao.body.password, 'Senha inválido (.RegEx)');
        const errors = contract.errors();

        if(errors.length == 0){
            Customer.findByIdAndUpdate(requisicao.params.id , {
                $set: {
                    name: requisicao.body.name,
                    email: requisicao.body.email,
                    password: requisicao.body.password
                }
            }).then(dados => {
                resposta.status(200).send({ message: 'Cliente atualizado com sucesso! :)' });
            })
            .catch(e => {
                resposta.status(400).send({ message: `Falha ao atualizar :'(`, data: e });
            });
        } else{
            resposta.status(400).send(errors);
        }

        contract.clear();
    })

    app.delete('/customers/:id', (requisicao, resposta) => {
        Customer.findByIdAndRemove(requisicao.params.id) //posso passar requisicao.body.id se eu não me sentir confortável passando o id como parâmetro na url
            .then(dados => {
                resposta.status(200).send({ message: 'Cliente deletado com sucesso! :)' });
            })
            .catch(erro => {
                resposta.satus(401).send({ message: `Falha ao deletar :'(`, data: e } );
            });
    })
};