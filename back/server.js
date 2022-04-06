const http = require('http');
const app = require('./routers/app');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

mongoose.connect('mongodb+srv://user:user@actions-cluster.vixdx.mongodb.net/<dbname>?retryWrites=true&w=majority',
{ useNewUrlParser: true,
  useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to DB!'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//gestion du port
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >=0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

// gestion des erreurs
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: '  + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges!');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use!');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on: ' + bind);
});

server.listen(port);