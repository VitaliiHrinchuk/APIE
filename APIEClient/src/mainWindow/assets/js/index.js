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


const MAIN_URL = "https://apie.herokuapp.com/";
// const MAIN_URL = "http://localhost:5000/";
// const SOCKET_URL = `${MAIN_URL}socket`;
const API_URL = `${MAIN_URL}api/`;



axios.defaults.headers.common['authorization'] = 'Bearer '+userData.token;


const modal = document.getElementById('modal-bg');
const loader = document.getElementById('loader');
const statusEl = document.getElementById('status');
loader.style.display = "block";



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

function updateData(data){
    if(userData.type == USER_TYPES.telegraph){
 
        axios.put(`${API_URL}flights/`, data).then(res=>{
            console.log(res);
            
        }, err=>{
            throw err;
        })
    } else {
        return;
    }
}

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

let tabledata = [];


//init table
var table = new Tabulator("#example-table", {
    data:tabledata, //assign data to table
    layout:"fitColumns", //fit columns to width of table (optional)
    paginationSize:12,
    pagination:"local",
    paginationAddRow:"table",
    cellEdited:function(data){

        let newData = data._cell.row.data;
        console.log(newData);
        updateData(newData);
    
        
    },
    columns:[ //Define Table Columns
        {title:"id",    field:"id",       headerSort:false, visible: false},
        {title:"Flight",    field:"flight",       headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Type",      field:"type",         headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Departure", field:"departure",    headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Arrival",   field:"arrival",      headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Number",    field:"number",       headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Access",    field:"access",       headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
        {title:"Created",   field:"creation_date",headerSort:false, editor: userData.type == USER_TYPES.telegraph ? true : false},
    ],
 
});

axios.get(API_URL+"flights/").then(res=>{
    console.log(res);
    table.addData(res.data.reverse());
    loader.style.display = "none";
}, err=>{
    console.log(err);
    loader.style.display = "none";
})


// init socket
let socket = io(MAIN_URL, {path: '/socket'});

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
    console.log(data); 
    table.addData(data.flight, true, 0).then(rows=>{
        console.log(rows);
        
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
    console.log(data);
 
    
    console.log("updating...");
    
    table.updateData([data.flight]).then(()=>{
    
        let row = table.searchRows("id", "=", data.flight.id);
        let element = row[0]._row.element;
        console.log(row);
        
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
})



document.getElementById('addDataBtn').addEventListener('click', ()=>modal.style.display = "block");
document.getElementById('modal-close').addEventListener('click', ()=>modal.style.display = "none");
document.getElementById('post_sumbit').addEventListener('click', postData);
document.getElementById('exitBtn').addEventListener('click', ()=>remote.getCurrentWindow().close())