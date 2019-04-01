const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url')
// require('electron-reload')(__dirname);
const ipc = require('electron').ipcMain;



let authWin, mainWin;


function createAuthWindow(){
    authWin = new BrowserWindow({width: 1000, height: 800});


    // authWin.loadFile(path.join(__dirname, "authWIndow/index.html"));

    authWin.loadURL(url.format({
        pathname: path.join(__dirname, '/authWindow/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    //   authWin.webContents.openDevTools()
    authWin.on('closed', () => {
        authWin = null
      })
}

function createMainWindow(){
    mainWin = new BrowserWindow({fullscreen: true});

    // mainWin.loadFile(path.join(__dirname, "mainWindow/index.html"));

    mainWin.loadURL(url.format({
        pathname: path.join(__dirname, '/mainWindow/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    mainWin.on('closed', () => {
        mainWin = null;
        authWin.show();
      })
    mainWin.on('show', ()=>{
        
    })
    mainWin.webContents.send('setuser', {msg:"test"})
}

app.on('ready', createAuthWindow);

app.on('before-quit', ()=>{
    const authSes = authWin.webContents.session;
    const mainSes = mainWin.webContents.session;
    authSes.clearStorageData();
    mainSes.clearStorageData();
})
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

let userToken, userType;

ipc.on('logged', (event, arg)=>{

    createMainWindow();
    userToken = arg.token;
    userType = arg.type;
    mainWin.show();
    authWin.hide();    
})
ipc.on('setuser',(event, arg)=>{
    const userData = {token: userToken, type: userType};
    event.returnValue = userData;
})