const Model = require('../models/Model');
const bcrypt = require('bcrypt');

let model = new Model();

function validateExistFields(current, required){
    for (let i = 0; i < current.length; i++) {
        let found = required.some( item => item===current[i]);
        if(!found) return false;
    }
    return true;
}


module.exports = {

    // flights data
    getAllFlights(req, res){
        model.readFlights((err, result)=>{
            if(err) {
                console.log(err);
                return res.status(500);
            }
            res.json(result);
        })
    },

    //user data
    getUser(req, res){
        // check for request username existence
        if(!req.params.username) return res.status(400).json({msg:'No username'});
        model.readUser(req.params.username, (err, result)=>{
            if(err) throw err;

            // check for result
            if(result.length === 0) return res.status(400).json({msg: `No user with name: ${req.params.username}`});
            res.json({result});
        })
    },

    //login user
    loginUser(req, res){
    //check for request fields existing
      if(!req.body.username || !req.body.password){
          res.status(400).json({msg:"miss username or password"});
      }
      const username = req.body.username;
      const password = req.body.password;

      // search for user in DB
      model.readUser(req.body.username, (err,result)=>{
          if(err) throw err;
          // check for results
          if(result.length === 0) {
            res.status(400).json({msg: "user doesn`t exist"})
          } else {
            // compare hash and password from request
            bcrypt.compare(password,result[0].pass_hash, (err, result)=>{
                if(result){
                    res.json({msg:"authorized"});
                } else {
                    res.status(400).send({msg: "wrong user data"});
                }
            })
          }
        
      })
    },

    // create new user
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
            return res.json({msg:"added"})
        });


    }
}