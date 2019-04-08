

const io = require('socket.io-client');

const MAIN_URL = "https://apie.herokuapp.com/";
const table = require(path.join(__dirname,"table.js"));

const USER_TYPES = {
    dispatcher: 1,
    telegraph: 2
}
const userData = ipc.sendSync('setuser', "ok");

const statusEl = document.getElementById('status');

/**функція, яка змінює стиль і напис елемента
 * @param element елемент для зміни
 * @param status статус з`єднання
 */
function changeStatus(element, status){
    switch (status) {
        case 0:
            element.classList.add('status-offline');
            element.classList.remove('status-online', 'status-process');
            element.innerHTML = 'Status: offline';
            break;
        case 1:
            element.classList.add('status-online');
            element.classList.remove('status-offline', 'status-process');
            element.innerHTML = 'Status: online';
            break;
        case 2:
            element.classList.add('status-process');
            element.classList.remove('status-offline', 'status-online');
            element.innerHTML = 'Status: loading';
            break;
    }
}
/**ініціалізація сокету */
let socket = io(MAIN_URL, {path: '/socket'});
/**
* @name socket.on обробка події, які виникають під час обміну даними WebScoket
* @param {String}  event назва події
* @param function функція-обробник
*/
socket.on('connect', (data)=>{
    changeStatus(statusEl, 2);

    socket.on('authenticated', ()=>{
        console.log('connected to socket');
        changeStatus(statusEl, 1);
    }).emit('authenticate', {token: userData.token})
    
})

socket.on('disconnect', ()=>{
    changeStatus(statusEl, 0);
})

socket.on('newFlight', (data)=>{
    table.addData(data.flight, true, 0).then(rows=>{
        
        // adding animation on data updates
        let element = rows[0]._row.element;
        element.classList.add('fading-row-add');

        // remove animation class on end of animation
        element.addEventListener('animationend', ()=>{
            element.classList.remove('fading-row-add');
        })
    });
    let audio = new Audio("./assets/sounds/notification.mp3");
    audio.play();
})

socket.on('update', (data)=>{

    console.log("updating...");
    
    table.updateData([data.flight]).then(()=>{
    
        let row = table.searchRows("id", "=", data.flight.id);
        let element = row[0]._row.element;
        
        table.setPageToRow(row[0]);
        element.classList.add('fading-row-upd');

        // remove animation class on end of animation
        element.addEventListener('animationend', ()=>{
            element.classList.remove('fading-row-upd');
        })
        
    }, err=>{
        console.log(err);
        
    });
    let audio = new Audio("./assets/sounds/update.wav");
    audio.play();
    
});

socket.on('error', (err)=>{
    console.log(err);
})

socket.on('unauthorized', (err)=>{
    console.log(err);
    console.log("unauthorized");
});

