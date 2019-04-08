const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const http = require('http').Server(server);
const io = require('socket.io')(http, {
  path: '/socket'
});

require('./socket')(io);

const passport = require('passport');
require('./passport');

const auth = require('./controllers/auth');
const router = require('./routes/routes');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());



// add link to socket.io for all requests
// Додавання екземпляру socket.io для всіх запитів
server.use((req, res, next)=>{
  req.io = io;
  next();
})
// auth request
// Підключення обробника для обраного шляху запиту
server.use('/auth', auth);

// all api requests
// Підключення jwt-middleware та router для заданого шляху
server.use('/api/',passport.authenticate('jwt', {session: false}), router);

// Порт сервера
const PORT = process.env.PORT || 5000;

//Опис заголовків
io.origins('*:*') // for latest version

// Запуск сервера
http.listen(PORT, ()=>console.log('Server is listeningon port: ' + PORT));  

