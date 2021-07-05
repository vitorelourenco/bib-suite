import { existsSync, writeFileSync, readFileSync } from 'fs'

const electron = window.require('electron')
const remote = electron.remote
const { dialog } = remote

const fs = window.require('fs')
const pathModule = window.require('path')

const { app } = window.require('@electron/remote')
const appPath = app.getAppPath()

export async function getDirAsync() {
  const dialogChoice = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory', 'promptToCreate']
  })
  const dir = dialogChoice?.filePaths[0]
  return { dir, setWith: callback => dir && callback(dir) }
}

export async function saveFilePathAsync() {
  const dialogChoice = await dialog.showSaveDialog({
    properties: ['createDirectory'],
    filters: [
      {
        name: 'CSV file',
        extensions: ['csv']
      }
    ]
  })
  const file = dialogChoice?.filePath && dialogChoice.filePath
  return { file, setWith: callback => file && callback(file) }
}

export async function getCSVPathAsync(){
  const dialogChoice = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      {
        name: 'CSV file',
        extensions: ['csv']
      }
    ]
  });
  return dialogChoice?.filePaths[0];
}

export function getJPEGsFromFolder(dir) {
  try {
    const allFiles = fs.readdirSync(dir)
    const jpgRegExp = new RegExp(/(.jpg$)|(.JPG$)|(.jpeg$)|(.JPEG$)/)
    const jpgFiles = allFiles.filter(f => jpgRegExp.test(f))
    const jpgPaths = jpgFiles.map(file => pathModule.join(dir, file))

    return jpgPaths
  } catch (err) {
    console.log(err)
    if (dir === '') return []
    else alert(`Can't load from folder: ${dir}`)
  }
}
