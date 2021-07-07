
const electron = window.require('electron')
const remote = electron.remote
const { dialog } = remote

const fs = window.require('fs')
const pathModule = window.require('path')

export async function getDirAsync() {
  const dialogChoice = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory', 'promptToCreate']
  })
  if (dialogChoice.canceled) return "";
  const dir = dialogChoice.filePaths[0]
  return dir
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
  if (dialogChoice.canceled) return ""
  const path = dialogChoice.filePath;
  if (/.csv$/.test(path)) return path;
  else return path+'.csv';
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
  if (dialogChoice.canceled) return "";
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

export function bareCSVfile(path, obj){
  const keys = Object.keys(obj);
  const str = keys.reduce((acc, item) => acc += item+";\r\n","")

  fs.writeFileSync(path,str)
}
