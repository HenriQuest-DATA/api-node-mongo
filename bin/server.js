const app = require('../src/app.js');

const PORT = normalizePort(process.env.PORT || '3007');
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));

app.get('*', function(requisicao, resposta){
  resposta.send('Página não encontrada');
});

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
        return val;
    }
  
    if (port >= 0) {
      // port number
        return port;
    }
  
    return false;
}