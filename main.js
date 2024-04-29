import { app, BrowserWindow } from 'electron'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 960,
    height: 720
  })

  win.loadFile('./dist/index.html')
}

app.whenReady().then(() => {
  createWindow()
})
