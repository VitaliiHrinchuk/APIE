
const {app, BrowserWindow} = require('electron');

/**
 * Модуль Path який відповідає за побудову шляхів
 */
const path = require('path');

/**
 * Модуль, що надає змогу керувати відносними шляхами
 */
const url = require('url')

/**
 * екземпляр класу EventEmmiter, якйи надає змогу асинхронно взаємодіяти з процессами рендерингу із головного процесу
 */
const ipc = require('electron').ipcMain;

if(process.env.NODE_ENV === "development") require('electron-reload')(__dirname); 


/**об`єкти класу BrowserWindow, вікно авторизації*/
let authWin
/** об`єкти класу BrowserWindow, головне вікно */
let mainWin;


/**
 * Функція, яка свторює вікно авторизації
 */
function createAuthWindow(){
    authWin = new BrowserWindow({width: 1000, height: 800});


    // authWin.loadFile(path.join(__dirname, "authWIndow/index.html"));

    /**
     * завантажує html-файл для рендерингу
     */
    authWin.loadURL(url.format({
        pathname: path.join(__dirname, '/authWindow/index.html'),
        protocol: 'file:',
        slashes: true
      }));

    authWin.on('closed', () => {
        authWin = null
      })
}
/**
 * Функція, яка свторює головне вікно
 */
function createMainWindow(){
    mainWin = new BrowserWindow({fullscreen: true});

     /**
     * завантажує html-файл для рендерингу
     */
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


    // mainWin.webContents.send('setuser', {msg:"test"})
}

 
/**
 * Опис обробнику для подій додатку
 * @param {String} event назва події
 * @param function коллбек функція, яка генерує вікно авторизації
 */
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

/**Токен користувача */
let userToken; 
/**Ти користувача */
let userType;


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