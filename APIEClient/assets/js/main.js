// let promise = fetch("http://localhost:5000", {});
// console.log(promise);
const ipc = require('electron').ipcRenderer;

document.getElementById('loginBtn').addEventListener('click', ()=>{
    ipc.send('logged', "ok");
});