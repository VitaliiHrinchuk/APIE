const db = require('./dbconnection');

class Model {
    constructor(){
        this.db = db;
    }

    //change DB link
    setDB(db){
        this.db = db;
    }

    // read all data about flights
    readFlights(callback){
        let query = "SELECT * FROM flights";
        this.db.query(query,(err,result,fields)=>{
            return callback(err, result);
        });
    }

    // create new user in DB
    createUser(data,callback){
        let query = "INSERT INTO users (username, pass_hash, type) VALUES (?,?,?)";
        this.db.query(query, Object.values(data), (err, result)=>{
            return callback(err,result);
        });
    }

    // read all data about user by username
    readUser(username,callback){
        let query = "SELECT * FROM `users` WHERE `username` = ?";
        this.db.query(query,[username], (err, result)=>{
            if(!result) return callback(err,false);
            return callback(err, result[0]);
   
        })
        // return new Promise((resolve, reject)=>{
        //     this.db.query(query,[username], (err, result)=>{
        //         if(err) reject(err);
        //         resolve(result);
        //         // return callback(err, result);
       
        //     })
        // })
  
    }

    //create new flight
    createFlight(data, callback){
        let query = "INSERT INTO flights (flight,type,departure,arrival,number,access) VALUES (?,?,?,?,?,?)";
        this.db.query(query, Object.values(data),(err, result)=>{
            return callback(err, result);
        })
    }
}

module.exports = new Model();