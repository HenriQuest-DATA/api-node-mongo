module.exports = app => {
    app.get('/', (requisicao, resposta) => {
        resposta.status(200).send({
            title: 'balta API',
            version: '1.0.0'
        });
    })

    // app.post('/', (requisicao, resposta, next) => {
    //     resposta.status(201).send(requisicao.body);
    // })

    // app.put('/:id', (requisicao, resposta, next) => {
    //     resposta.status(201).send({
    //         id: requisicao.params.id,
    //         item: requisicao.body
    //     });
    // })

    // app.delete('/:id', (requisicao, resposta, next) => {
    //     resposta.status(201).send({
    //         id: requisicao.params.id,
    //         item: requisicao.body
    //     });
    // })
};