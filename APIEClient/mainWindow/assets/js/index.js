const Tabulator = require('tabulator-tables');
const ipc = require('electron').ipcRenderer;
const axios = require('axios');
const io = require('socket.io-client');



const userData = ipc.sendSync('setuser', "ok");

const MAIN_URL = "http://localhost:5000/";
// const SOCKET_URL = `${MAIN_URL}socket`;
const API_URL = `${MAIN_URL}api/`;



axios.defaults.headers.common['authorization'] = 'Bearer '+userData.token;


const modal = document.getElementById('modal-bg');

document.getElementById('addDataBtn').addEventListener('click', ()=>modal.style.display = "block");
document.getElementById('modal-close').addEventListener('click', ()=>modal.style.display = "none");


let socket = io(MAIN_URL, {path: '/socket'});



socket.on('connect', (res)=>{

    socket.on('authenticated', ()=>{
        console.log('connected to socket');
        socket.on('newFlight', (data)=>{
            console.log(data);
            
        })
    }).emit('authenticate', {token: userData.token})

    socket.on('error', (err)=>{
        console.log(err);
    })

    socket.on('unauthorized', (err)=>{
        console.log(err);
        
    })
});


let tabledata = [];

var table = new Tabulator("#example-table", {
 
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
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
    table.addData(res.data);
}, err=>{
    console.log(err);
    
})

