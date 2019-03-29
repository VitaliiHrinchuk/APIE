const socketJWT = require('socketio-jwt');

module.exports = (io)=>{

    io.on('connection',  socketJWT.authorize({
        secret: 'secretkey',
        timeout: 15000,
    })).on('authenticated', (socket)=>{
        console.log(`user ${socket.decoded_token.user} connected`);
        
    })

}