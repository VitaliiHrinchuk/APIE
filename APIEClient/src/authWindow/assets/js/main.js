
/**
 * модуль, ща надає функціонал для здійснення AJAX-запитів
 */
const axios = require('axios');

const ipc = require('electron').ipcRenderer;

/**Посилання на дані головного процесу */
const remote = require('electron').remote;

/**Посилання до API на сторінку авторизації  */
const URL = "https://apie.herokuapp.com/auth/login/";
// const URL = "http://localhost:5000/auth/login/";

/**Елемент вводу імені користувача */
let usernameField = document.getElementById('username');
/**Елемент вводу паролю користувача */
let passwordField = document.getElementById('password');

usernameField.addEventListener('input', ()=>usernameField.classList.remove('errorInput'))
passwordField.addEventListener('input', ()=>passwordField.classList.remove('errorInput'))

/**Елемент, який відображаєтсья при завантажені даних */
let loader = document.getElementById('loader')



/**
 *
 * Ця функція-callback здійснює авторизацію користувача
 */
function login(){
    let body = {
        username: usernameField.value,
        password: passwordField.value
    };

    loader.style.display = "block";
    document.getElementById('errorBlock').style.opacity = "0";
    usernameField.classList.remove('errorInput');
    passwordField.classList.remove('errorInput');

    axios.post(URL,body).then(res=>{
        console.log(res);
        if(res.data.logged === true){
            ipc.send('logged', {token: res.data.token, type: res.data.type});
            localStorage.setItem('token', res.data.token)
        }
        loader.style.display = "none";
    }).catch(err=>{
        console.log(err.response);
        if(err.response.status === 400){
            usernameField.classList.add('errorInput');
            passwordField.classList.add('errorInput');
            document.getElementById('errorBlock').style.opacity = "1";
        }
        
        loader.style.display = "none";
    })
    
}


document.getElementById('loginBtn').addEventListener('click', login);
/**
 * Обробник взаємодії користувача із додатком
 * @param {String} event назва події
 * @param {functio} callback обробник події
 */
document.getElementById('password').addEventListener('keypress', (event)=>{
    if(event.keyCode === 13) login();
});

document.getElementById('username').addEventListener('keypress', (event)=>{
    if(event.keyCode === 13) login();
});

document.getElementById('exitBtn').addEventListener('click', ()=>remote.getCurrentWindow().close())