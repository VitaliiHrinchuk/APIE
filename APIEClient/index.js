const {app, BrowserWindow} = require('electron');

require('electron-reload')(__dirname);
const ipc = require('electron').ipcMain;



let authWin, mainWin;

ipc.on('logged', (event, arg)=>{
    authWin.hide();
})


function createAuthWindow(){
    authWin = new BrowserWindow({fullscreen: true});


    authWin.loadFile('index.html');


    authWin.on('closed', () => {
        authWin = null
      })
}

app.on('ready', createAuthWindow);


app.on('window-all-closed', ()=>{
    if(process.platform !== "darwin"){
        app.quit();
    }
})

app.on('activate', ()=>{
    if(authWin === null){
        createAuthWindow();
    }
})