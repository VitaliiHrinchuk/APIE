const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');


// login user and return him token if success
router.post('/login', (req, res, next)=>{
    
    // authentificate user
    passport.authenticate('local', {session: false}, (err, user, info)=>{

        
        if(err || !user){
            return res.status(400).json({
                msg: info ? info.message : "Login failed",
                user: user
            });
        }

        
        
        req.login(user, {session: false}, (err)=>{
            if(err) return res.send(err);

            //create new token

            const token = jwt.sign({user}, 'secretkey',{expiresIn: "6h"});
            return res.json({user, token});
        });
    })(req,res);

});

module.exports = router;

