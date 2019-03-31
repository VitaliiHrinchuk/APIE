
const axios = require('axios');
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;



const URL = "http://127.0.0.1:5000/auth/login/";

let usernameField = document.getElementById('username');
let passwordField = document.getElementById('password');

usernameField.addEventListener('input', ()=>usernameField.classList.remove('errorInput'))
passwordField.addEventListener('input', ()=>passwordField.classList.remove('errorInput'))

let loader = document.getElementById('loader')




function login(){
    let body = {
        username: usernameField.value,
        password: passwordField.value
    };
    // let options = {
    //     method:"POST",
    //     headers: {"Content-Type": "application/json"}, 
    //     body:JSON.stringify(body),
    //     credentials:'same-origin',

    // }
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
    
    // let fetchLogin = fetch(`${URL}/auth/login/`, options).then(res=>{
    //     return res.json();
    // }, (err)=>{
    //     loader.style.display = "none";
    //     console.log("error");
        
    //     console.log(err.message);
    // }).then(data=>{
    //     loader.style.display = "none";
    //     console.log(data);
        
    // })
}

document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('password').addEventListener('keypress', (event)=>{
    if(event.keyCode === 13) login();
});
document.getElementById('username').addEventListener('keypress', (event)=>{
    if(event.keyCode === 13) login();
});
document.getElementById('exitBtn').addEventListener('click', ()=>remote.getCurrentWindow().close())