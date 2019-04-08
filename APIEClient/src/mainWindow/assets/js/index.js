// const Tabulator = require('tabulator-tables');
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const axios = require('axios');
// const io = require('socket.io-client');
const path = require('path');

/**@see {table} підключення модуля*/
const table = require(path.join(__dirname,"assets/js/table.js"));
/**
 * @name require(socket)
 * @see {socket} підключення модуля*/
require(path.join(__dirname,"assets/js/socket.js"));

/**Об`єкт, що містить типи користувачів */
const USER_TYPES = {
    dispatcher: 1,
    telegraph: 2
}

/** ініціалізація події  setuser*/
const userData = ipc.sendSync('setuser', "ok");
/**Встановлення параметру авторизації в заголовки по замовчуванню */
axios.defaults.headers.common['authorization'] = 'Bearer '+userData.token;

if(userData.type == USER_TYPES.telegraph){
    document.getElementById('addDataBtn').style.display = 'block';
}

/**
 * Посилання на корінь API
 */
const MAIN_URL = "https://apie.herokuapp.com/";

const API_URL = `${MAIN_URL}api/`;






const modal = document.getElementById('modal-bg');
const loader = document.getElementById('loader');

loader.style.display = "block";


/** функція, що здійснює post-запит до серверу для свторення нового запису */
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
        }, err=>{
            throw err;
        })
    } else {
        return;
    }
}

/**Обробник події, який реагує на змінення даних в таблиці і синхронізує їх із сервером */
table.options.cellEdited = function(data){
    if(userData.type == USER_TYPES.telegraph){
 
        axios.put(`${API_URL}flights/`, data._cell.row.data).then(res=>{

        }, err=>{
            throw err;
        })
    } else {
        return;
    }
}


axios.get(API_URL+"flights/").then(res=>{

    table.addData(res.data.reverse());
    loader.style.display = "none";
}, err=>{

    loader.style.display = "none";
})


document.getElementById('addDataBtn').addEventListener('click', ()=>modal.style.display = "block");
document.getElementById('modal-close').addEventListener('click', ()=>modal.style.display = "none");
document.getElementById('post_sumbit').addEventListener('click', postData);
document.getElementById('exitBtn').addEventListener('click', ()=>remote.getCurrentWindow().close())