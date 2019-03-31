const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mysql = require('mysql');
const http = require('http').Server(server);
const io = require('socket.io')(http, {
  path: '/socket'
});

const ioController = require('./socket')(io);




const passport = require('passport');
require('./passport');


// server.use((req,res,next)=>{
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// })

const auth = require('./controllers/auth');
const router = require('./routes/routes');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());




let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "apie"
});


// server.use((req,res,next)=>{
//   req.db = db;
//   next();
// });
// routes(server, db);

// add link to socket.io for all requests
server.use((req, res, next)=>{
  req.io = io;
  next();
})
// auth request
server.use('/auth', auth);

// all api requests
server.use('/api/',passport.authenticate('jwt', {session: false}), router);



// server.use('/api/',(req, res,next)=>{
//   passport.authenticate('jwt', {session: false}, ())
// }, router);

const PORT = process.env.PORT || 5000;


io.origins('*:*') // for latest version
// io.on('connection', (socket)=>{
//   console.log("connected");
  
// })

http.listen(PORT, ()=>console.log('Server is listeningon port: ' + PORT));  

  // db.connect((err)=>{
  //     if(err) throw err;
  //     console.log('connected to DB');
  //     server.listen(PORT, ()=>{
  //       console.log('Server is listeningon port: ' + PORT);
        
  //   });
    
  // });

  // db.query('SELECT * FROM flights', function (error, results, fields) {
  //   if (error) throw error;
  //   console.log('The solution is: ', results[0]);
  // });

