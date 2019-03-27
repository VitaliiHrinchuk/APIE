const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mysql = require('mysql');



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

server.use('/', router);

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=>console.log('Server is listeningon port: ' + PORT));  


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
