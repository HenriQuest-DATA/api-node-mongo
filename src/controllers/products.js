const Product = require('../models/products');
const validationContract = require('../validations/validations');
const authService = require('../services/auth');

module.exports = app => {
    app.get('/products', (requisicao, resposta) => {
        Product.find({ active: true }, "title price slug")
            .then(dados => {
                resposta.status(200).send(dados);
            })
            .catch(erro => {
                resposta.satus(401).send(erro.message);
            });
    })
    // app.get('/products', async (requisicao, resposta) => {
    //     var dados = await Product.find({ active: true }, "title price slug")
    //     resposta.status(200).send(dados);
    // })

    app.get('/products/slug/:slug', (requisicao, resposta) => {
        Product.find({ active: true, slug:requisicao.params.slug }, "title price slug tags")
            .then(dados => {
                resposta.status(200).send(dados);
            })
            .catch(erro => {
                resposta.satus(401).send(erro.message);
            });
    })
    // app.get('/products/slug/:slug', async (requisicao, resposta) => {
    //     var dados = await Product.find({ active: true, slug:requisicao.params.slug }, "title price slug tags")
    //     resposta.status(200).send(dados);
    // })

    app.get('/products/tags/:tags', (requisicao, resposta) => {
        Product.find({ tags: requisicao.params.tags, active: true }, 'title price slug tags')
            .then(dados => {
                resposta.status(200).send(dados);
            })
            .catch(erro => {
                resposta.satus(401).send(erro.message);
            });
    })

    app.post('/products', authService.authorize, authService.authorizeADM, (requisicao, resposta, next) => {
        const product = new Product(requisicao.body);
        const contract = new validationContract();

        contract.hasMinLen(requisicao.body.title, 3, 'Título inválido (.Min)');
        contract.hasMaxLen(requisicao.body.title, 20, 'Título inválido (.Max)');
        contract.hasMinLen(requisicao.body.slug, 3, 'Slug inválido (.Min)');
        contract.hasMaxLen(requisicao.body.slug, 20, 'Slug inválido (.Max)');
        contract.hasMinLen(requisicao.body.description, 10, 'Descrição inválido (.Min)');
        contract.hasMaxLen(requisicao.body.description, 200, 'Descrição inválido (.Max)');
        const errors = contract.errors();

        if(errors.length == 0){
            product.save()
            .then(() => {
                resposta.status(200).send({ message: 'Produto cadastrado com sucesso! :)' });
            })
            .catch(e => {
                resposta.status(400).send({ message: `Falha ao cadastrar :'(`, data: e });
            });
        } else{
            resposta.status(400).send(errors);
        }

        contract.clear();
    })
    // app.post('/products', async (requisicao, resposta, next) => {
    //     const product = new Product(requisicao.body);
    //     const contract = new validationContract();

    //     contract.hasMinLen(requisicao.body.title, 3, 'Título inválido (.Min)');
    //     contract.hasMaxLen(requisicao.body.title, 20, 'Título inválido (.Max)');
    //     contract.hasMinLen(requisicao.body.slug, 3, 'Slug inválido (.Min)');
    //     contract.hasMaxLen(requisicao.body.slug, 20, 'Slug inválido (.Max)');
    //     contract.hasMinLen(requisicao.body.description, 10, 'Descrição inválido (.Min)');
    //     contract.hasMaxLen(requisicao.body.description, 200, 'Descrição inválido (.Max)');
    //     const errors = contract.errors();

    //     if(errors.length == 0){
    //         await product.save()
    //         resposta.status(200).send({ message: 'Produto cadastrado com sucesso! :)' });
    //     } else{
    //         resposta.status(400).send(errors);
    //     }

    //     contract.clear();
    // })

    app.put('/products/:id', authService.authorizeADM, (requisicao, resposta) => {
        const contract = new validationContract();
        //console.log(requisicao.body);

        contract.hasMinLen(requisicao.body.title, 3, 'Título inválido (.Min)');
        contract.hasMaxLen(requisicao.body.title, 20, 'Título inválido (.Max)');
        contract.hasMinLen(requisicao.body.slug, 3, 'Slug inválido (.Min)');
        contract.hasMaxLen(requisicao.body.slug, 20, 'Slug inválido (.Max)');
        contract.hasMinLen(requisicao.body.description, 10, 'Descrição inválido (.Min)');
        contract.hasMaxLen(requisicao.body.description, 200, 'Descrição inválido (.Max)');
        const errors = contract.errors();

        if(errors.length == 0){
            Product.findByIdAndUpdate(requisicao.params.id , {
                $set: {
                    title: requisicao.body.title,
                    slug: requisicao.body.slug,
                    description: requisicao.body.description,
                    price: requisicao.body.price
                }
            }).then(dados => {
                resposta.status(200).send({ message: 'Produto atualizado com sucesso! :)' });
            })
            .catch(e => {
                resposta.status(400).send({ message: `Falha ao atualizar :'(`, data: e });
            });
        } else{
            resposta.status(400).send(errors);
        }

        contract.clear();
    })

    app.delete('/products/:id', (requisicao, resposta) => {
        Product.findByIdAndRemove(requisicao.params.id) //posso passar requisicao.body.id se eu não me sentir confortável passando o id como parâmetro na url
            .then(dados => {
                resposta.status(200).send({ message: 'Produto deletado com sucesso! :)' });
            })
            .catch(erro => {
                resposta.satus(401).send({ message: `Falha ao deletar :'(`, data: e } );
            });
    })
};