// const Model = require('../models/Model');

const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// let model = new Model(db);

  // user auth
  // router.post('/api/user/login/', (req,res)=>{
  //     //check for request field
  //     if(!req.body.username || !req.body.password){
  //         res.status(400);
  //         res.send({"message":"bad request"});
  //     }
  //     const username = req.body.username;
  //     const password = req.body.password;

  //     // serach for user in DB
  //     model.readUser(req.body.username, (err,result)=>{
  //         if(err) throw err;
  //         // check for results
  //         if(result.length === 0 ) {
  //           res.send({"message": "user doesn`t exist"})
  //         } else {
  //           // compare hash and password from request
  //           bcrypt.compare(password,result[0].pass_hash, (err, result)=>{
  //               if(result){
  //                   res.send({"message":"authorized"});
  //               } else {
  //                   res.send({"message": "wrong data"});
  //               }
  //           })
  //         }
        
  //     })
  // });

//   app.post('/api/user/create/', (req, res)=>{

//     bcrypt.hash(req.body.password,10,(err, hash)=>{
//         if(err) throw err;
//         model.createUser(req.body.username,hash,(err,result)=>{
//             if(err){ 
//                 if(err.errno === 1062){
//                     res.status(400);
//                     res.send({"error": "user exist"});
//                 } else {
//                     res.status(500);
//                     throw err;
//                 }
//             }
//             res.status(200);
//             res.send({"status": "registered"});
//         })
//     })
//   });
// router.post('/api/login', controller.loginUser)

router.get('/flights/',controller.getAllFlights);
router.post('/flights/', controller.postFlight);
router.put('/flights/', controller.updateFlight);

router.get('/user/:username', controller.getUser);
router.post('/user/create/', controller.createUser);


module.exports = router;