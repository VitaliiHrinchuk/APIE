// passport config

const passport = require('passport');
const passportJWT = require('passport-jwt');

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

const bcrypt = require('bcrypt');
const model = require('./models/Model');


// config local strategy for username+password auth
passport.use(new LocalStrategy(
    (username, password, callback)=>{
        
        //check for user
        model.readUser(username, (err, result)=>{
            if(err) return callback(err);
            if(!result) return callback(null, false, {message:"incorrect username or password"});

            // compare password hash
            bcrypt.compare(password, result.pass_hash, (err, compared)=>{
                if(err) throw err;
                if(!compared) return callback(null, false, {message:"incorrect username or password"});                
                return callback(null, {username: result.username, type: result.type}, {message:"logged in succesfully"})
            } );
        });
    } ));

// config JSON WEB TOKEN strategy for verifying user every request
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: "secretkey"
    },
    (jwtPayload, callback)=>{     
    
           
        model.readUser(jwtPayload.user, (err, result)=>{
            if(err) return callback(err);
            if(!result) callback(null, false);
            return callback(null, result.username);
        });
    }));