const Tabulator = require('tabulator-tables');
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const axios = require('axios');
const io = require('socket.io-client');

const USER_TYPES = {
    dispatcher: 1,
    telegraph: 2
}


const userData = ipc.sendSync('setuser', "ok");

if(userData.type == USER_TYPES.telegraph){
    document.getElementById('addDataBtn').style.display = 'block';
}


const MAIN_URL = "http://localhost:5000/";
// const SOCKET_URL = `${MAIN_URL}socket`;
const API_URL = `${MAIN_URL}api/`;



axios.defaults.headers.common['authorization'] = 'Bearer '+userData.token;


const modal = document.getElementById('modal-bg');


// function that posts new data to server
function postData(){
    if(userData.type == USER_TYPES.telegraph){
        let data = {
            "flight":        document.getElementById('post_flight').value.toUpperCase(),
            "type":          document.getElementById('post_type').value.toUpperCase(),
            "departure":     document.getElementById('post_departure').value.toUpperCase(),
            "arrival":       document.getElementById('post_arrival').value.toUpperCase(),
            "number":        document.getElementById('post_number').value.toUpperCase(),
            "access":        document.getElementById('post_access').value.toUpperCase()
        }

        axios.post(`${API_URL}flights/`, data).then(res=>{
            console.log(res);
            
        }, err=>{
            throw err;
        })
    } else {
        return;
    }
}


let tabledata = [];


//init table
var table = new Tabulator("#example-table", {
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    paginationSize:12,
    pagination:"local",
 
    columns:[ //Define Table Columns
        {title:"Flight", field:"flight",headerSort:false},
        {title:"Type", field:"type",headerSort:false},
        {title:"Departure", field:"departure",headerSort:false},
        {title:"Arrival", field:"arrival",headerSort:false},
        {title:"Number", field:"number",headerSort:false},
        {title:"Access", field:"access",headerSort:false},
        {title:"Created", field:"creation_date",headerSort:false},
    ],
 
});

axios.get(API_URL+"flights/").then(res=>{
    console.log(res);
    table.addData(res.data.reverse());
}, err=>{
    console.log(err);
    
})


// init socket
let socket = io(MAIN_URL, {path: '/socket'});

socket.on('connect', (data)=>{

    socket.on('authenticated', ()=>{
        console.log('connected to socket');
    
    }).emit('authenticate', {token: userData.token})
    
})

socket.on('newFlight', (data)=>{
    console.log(data); 
    table.addData(data.flight, true).then(rows=>{
        console.log(rows);
        
        // adding animation on data updates
        let element = rows[0]._row.element;
        element.classList.add('fading-row');

        // remove animation class on end of animation
        element.addEventListener('animationend', ()=>{
            element.classList.remove('fading-row');
        })
    });
    let audio = new Audio("./assets/sounds/notification.mp3");
    audio.play();
})

socket.on('error', (err)=>{
    console.log(err);
})

socket.on('unauthorized', (err)=>{
    console.log(err);
    console.log("unauthorized");
})



document.getElementById('addDataBtn').addEventListener('click', ()=>modal.style.display = "block");
document.getElementById('modal-close').addEventListener('click', ()=>modal.style.display = "none");
document.getElementById('post_sumbit').addEventListener('click', postData);
document.getElementById('exitBtn').addEventListener('click', ()=>remote.getCurrentWindow().close())