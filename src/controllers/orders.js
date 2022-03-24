const Order = require('../models/orders');
const Product = require('../models/products');
const validationContract = require('../validations/validations');
const guid = require('guid');
const authService = require('../services/auth');

module.exports = app => {
    app.get('/orders', (requisicao, resposta) => {
        Order.find({}, "date status items").populate('customer').populate('items.product')
            .then(dados => {
                resposta.status(200).send(dados);
            })
            .catch(erro => {
                resposta.satus(401).send(erro.message);
            });
    })

    app.post('/orders', authService.authorize, async (requisicao, resposta, next) => {
        
        var token = requisicao.body.token || requisicao.query.token || requisicao.headers['x-access-token'];
        const tokenDecrypted = await authService.decodeToken(token);

        const order = new Order({
            customer: tokenDecrypted.id,
            number: guid.raw().substring(0, 6),
            items: requisicao.body.items
        });

        order.save()
            .then(() => {
                resposta.status(200).send({ message: 'Ordem cadastrada com sucesso! :)' });
            })
            .catch(e => {
                resposta.status(400).send({ message: `Falha ao cadastrar :'(`, data: e });
            });
    })

    // app.put('/orders/:id', (requisicao, resposta) => {
    //     const contract = new validationContract();

    //     // contract.hasMinLen(requisicao.body.title, 3, 'Título inválido (.Min)');
    //     // contract.hasMaxLen(requisicao.body.title, 20, 'Título inválido (.Max)');
    //     // contract.hasMinLen(requisicao.body.slug, 3, 'Slug inválido (.Min)');
    //     // contract.hasMaxLen(requisicao.body.slug, 20, 'Slug inválido (.Max)');
    //     // contract.hasMinLen(requisicao.body.description, 10, 'Descrição inválido (.Min)');
    //     // contract.hasMaxLen(requisicao.body.description, 200, 'Descrição inválido (.Max)');
    //     // const errors = contract.errors();

    //     if(errors.length == 0){
    //         Order.findByIdAndUpdate(requisicao.params.id , {
    //             $set: {
    //                 number: requisicao.body.number,
    //                 date: requisicao.body.date,
    //                 status: requisicao.body.status,
    //                 items: requisicao.body.items
    //             }
    //         }).then(dados => {
    //             resposta.status(200).send({ message: 'Ordem atualizado com sucesso! :)' });
    //         })
    //         .catch(e => {
    //             resposta.status(400).send({ message: `Falha ao atualizar :'(`, data: e });
    //         });
    //     } else{
    //         resposta.status(400).send(errors);
    //     }
    //     //contract.clear();
    // })

    // app.delete('/orders/:id', (requisicao, resposta) => {
    //     Order.findByIdAndRemove(requisicao.params.id) //posso passar requisicao.body.id se eu não me sentir confortável passando o id como parâmetro na url
    //         .then(dados => {
    //             resposta.status(200).send({ message: 'Order deletado com sucesso! :)' });
    //         })
    //         .catch(erro => {
    //             resposta.satus(401).send({ message: `Falha ao deletar :'(`, data: e } );
    //         });
    // })
};