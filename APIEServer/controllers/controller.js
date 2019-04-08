const model = require('../models/Model');
const bcrypt = require('bcrypt');

// function that validates req.body fields with required fields
/**
 * Функція, яка виконує валідацію масивів
 * @param {Array} current поточний масив
 * @param {Array} required контрольний масив
 */
function validateExistFields(current, required){
    for (let i = 0; i < current.length; i++) {
        let found = required.some( item => item===current[i]);
        if(!found) return false;
    }
    return true;
}


module.exports = {

    // flights data
    /**
     * Функція-обробник запиту на сервер, яка обробляє запит на отримання всіх записів flights 
     * @param {Object} req запит від Клієнта
     * @param {Object} res відповідь від Сервера
     */
    getAllFlights(req, res){    
        model.readFlights((err, result)=>{
            if(err) {
                console.log(err);
                return res.status(500);
            }
            return res.json(result);
        })
    },

    //user data
    /**
     * Функція-обробник запиту на сервер, яка обробляє запит на отримання даних про користувача
     * @param {Object} req запит від Клієнта
     * @param {Object} res відповідь від Сервера
     */
    getUser(req, res){
        // check for request username existence
        if(!req.params.username) return res.status(400).json({msg:'No username'});
        model.readUser(req.params.username, (err, result)=>{
            if(err) throw err;

            // check for result
            if(!result) return res.status(400).json({msg: `No user with name: ${req.params.username}`});
            res.json({user:result});
        })
    },

    // create new user
    /**
     * Функція-обробник запиту на сервер, яка обробляє запит на створення нового користувача
     * @param {Object} req запит від Клієнта
     * @param {Object} res відповідь від Сервера
     */
    createUser(req,res){
        //check for request fields existing
        if(!req.body.password || !req.body.username || !req.body.type) return res.status(400).json({msg: "Bad request"});
       
        // crypting the password
        bcrypt.hash(req.body.password, 10, (err, hash)=>{
                    if(err) throw err;

                    //create new user in DB
                    model.createUser({
                        username: req.body.username,
                        passHash: hash,
                        type: parseInt(req.body.type),
                    },(err,result)=>{
                        if(err){ 
                            if(err.errno === 1062){
                                res.status(400).json({msg: "user exist"});
                            } else {
                                res.status(500);
                                throw err;
                            }
                        }
                        // res.status(200);
                        res.json({msg: "registered"});
                    })
             })
    },

    //insert new data to flights 
    /**
     * Функція-обробник запиту на сервер, яка обробляє запит на створення нового рейсу flights
     * @param {Object} req запит від Клієнта
     * @param {Object} res відповідь від Сервера
     */
    postFlight(req, res){
        let requiredFields = ["flight","type","departure", "arrival", "number", "access"];
        let check = validateExistFields(Object.keys(req.body), requiredFields);

        if(!check) return res.status(400).json({msg:"missed required fields"})

        // create object with flight data
        let data = {
            flight:        req.body.flight,
            type:          req.body.type,
            departure:     req.body.departure,
            arrival:       req.body.arrival,
            number:        req.body.number,
            access:        req.body.access
        }

        model.createFlight(data, (err, result)=>{
            if(err) {
                res.status(500); 
                throw err;
            }
            model.readFlightById(result.insertId, (err, flight)=>{
				if(err) {
					console.log(err);
					return req.io.emit('newFlight', {status:"false"})
				};
            	console.log("result is: ", flight);
            	return req.io.emit('newFlight', {status:"true", flight: flight});
			})

            
            return res.json({msg:"added"})
        });
    },
    /**
     * Функція-обробник запиту на сервер, яка обробляє запит на оновлення даних про рейс flights
     * @param {Object} req запит від Клієнта
     * @param {Object} res відповідь від Сервера
     */
    updateFlight(req, res){
        let requiredFields = ["flight","type","departure", "arrival", "number", "access"];
        let check = validateExistFields(Object.keys(req.body).push(req.body.id), requiredFields);

        if(!check) return res.status(400).json({msg:"missed required fields"})

        // create object with flight data
        let data = {
            flight:        req.body.flight,
            type:          req.body.type,
            departure:     req.body.departure,
            arrival:       req.body.arrival,
            number:        req.body.number,
            access:        req.body.access
        }
        let id = req.body.id;
        model.updateFlight(data, id, (err, result)=>{
            if(err) {
                res.status(500); 
                throw err;
            }
            model.readFlightById(id, (err, flight)=>{
				if(err) {
					console.log(err);
					return req.io.emit('update', {status:"false"})
				};
            	console.log("result is: ", flight);
            	return req.io.emit('update', {status:"true", flight: flight});
			})

            
            return res.json({msg:"updated"})
        });
    }
}