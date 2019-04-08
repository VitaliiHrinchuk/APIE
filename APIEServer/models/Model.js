const db = require('./dbconnection');


/**
 * @class Model
 * @description Класс, який Описує модель бази даних
 * @constructor створює зберігає екземпляр з`єднання із базою даних
 */
class Model {
    constructor(){
        this.db = db;
    }

    //change DB link
    /**
     * Змінює з`єднання
     * @param {mysql} db екземпляр класу mysql
     */
    setDB(db){
        this.db = db;
    }

    // read all data about flights
    /**
     * Зчитує всі дані з таблиці flights
     * @param {function} callback обробник запиту
     */
    readFlights(callback){
        let query = "SELECT * FROM flights";
        this.db.query(query,(err,result,fields)=>{
            return callback(err, result);
        });
    }

    // create new user in DB
    /**
     * Створює новий запис у таблиці users
     * @param {Object} data дані для запису
     * @param {function} callback обробник запиту
     */
    createUser(data,callback){
        let query = "INSERT INTO users (username, pass_hash, type) VALUES (?,?,?)";
        this.db.query(query, Object.values(data), (err, result)=>{
            return callback(err,result);
        });
    }

    // read all data about user by username
    /**
     * Зчитує запис з таблиці users
     * @param {String} username ім`я користувача для пошуку
     * @param {function} callback Обробник запиту
     */
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
    /**
     * Створює новий запис у таблиці flights
     * @param {Object} data дані для запису
     * @param {function} callback обробник запиту
     */
    createFlight(data, callback){
        let query = "INSERT INTO flights (flight,type,departure,arrival,number,access) VALUES (?,?,?,?,?,?)";
        this.db.query(query, Object.values(data),(err, result)=>{
            return callback(err, result);
        })
    }
    /**
     * Оновлює дані у таблиці flights
     * @param {Object} data дані для оновлення
     * @param {Integer} id ідентифікатор рядка
     * @param {function} callback обробник запиту
     */
    updateFlight(data, id, callback){
        // let query = "UPDATE flights SET flight = ?, type = ?,departure = ?,arrival = ?,number = ?,access = ? WHERE id = ?";
        let query = "UPDATE flights SET ? WHERE id = ?";
        this.db.query(query, [data, id],(err, result)=>{
            return callback(err, result);
        })
    }

    /**
     * зчитує дані з таблиці flights по id   
     * @param {Integer} id ідентифікатор рядка 
     * @param {function} callback обробник запиту
     */
    readFlightById(id, callback){
        let query = "SELECT * FROM flights WHERE id = ?";
        this.db.query(query, [parseInt(id)], (err, result)=>{
            if(!result) return callback(err, false);
            return callback(err, result[0]);
        });
    }
}

module.exports = new Model();