const {app, BrowserWindow} = require('electron');

require('electron-reload')(__dirname);
const ipc = require('electron').ipcMain;



let authWin, mainWin;


function createAuthWindow(){
    authWin = new BrowserWindow({width: 1000, height: 800});


    authWin.loadFile('./authWindow/index.html');


    authWin.on('closed', () => {
        authWin = null
      })
}

function createMainWindow(){
    mainWin = new BrowserWindow({fullscreen: true});

    mainWin.loadFile('./mainWindow/index.html')

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