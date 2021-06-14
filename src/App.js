import { useState, useMemo } from 'react'
import { FilesViewer } from './FilesViewer'
import Button from './components/Button';
const electron = window.require('electron');
const remote = electron.remote;
const {dialog} = remote

const fs = window.require('fs')
const pathModule = window.require('path')

const { app } = window.require('@electron/remote')

async function selectPicturesFolder(setPicturesFolder){
  const dialogChoice = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory', 'promptToCreate'] });
  const path = dialogChoice.filePaths[0];
  setPicturesFolder(path);
}

function App() {
  const [picturesFolder, setPicturesFolder] = useState(null);

  return (
    <div className="container mt-2">
      <Button 
        variant="primary"
        onClick={()=>selectPicturesFolder(setPicturesFolder)}
      >Select pictures folder</Button>
      <h4>{picturesFolder}</h4>
    </div>
  )
}

export default App;
