const config = require('../../config/config.js');
var sendGrid = require('@sendgrid/mail').setApiKey(config.sendGridKey);

// exports.send = async (to, subject, body) => {
//     sendGrid.send({
//         to: to,
//         from: 'henrique.aquinopk@gmail.com',
//         subject: subject,
//         html: body
//     });
// }
module.exports = async (to, subject, body) => {
    sendGrid.send({
        to: to,
        from: 'henrique.aquinopk@gmail.com',
        subject: subject,
        html: body
    });
}