import { app, BrowserWindow } from 'electron'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 960,
    height: 720,
    autoHideMenuBar: true,
    center:true,
    icon:'./dist/favicon.ico'
  })

  win.loadFile('./dist/index.html')
}

app.whenReady().then(() => {
  createWindow()
})
