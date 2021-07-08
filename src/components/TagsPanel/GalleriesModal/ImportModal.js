import styled from 'styled-components'
import { Button } from '../../Button'
import ReactModal from 'react-modal'
import { useContext, useState } from 'react'
import Images from '../../../contexts/Images'
import { useRef } from 'react'
import { useEffect } from 'react'

const electron = window.require('electron')
const remote = electron.remote
const { dialog } = remote

const fs = window.require('fs')
const pathModule = window.require('path')


export default function GalleriesModal({ setShowImportModal, setShowGalleries }) {
  const {galeries, setGaleries} = useContext(Images);

  const [descriptionOption, setDescriptionOption] = useState(null);
  const [activityOption, setActivityOption] = useState(null);
  const [tabCodeOption, setTabCodeOption] = useState(null);
  const [importFile, setImportFile] = useState(null);

  async function selectFile(){
    const dialogChoice = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'JSON file',
          extensions: ['JSON']
        }
      ]
    });
    if (dialogChoice.canceled) return;
    setImportFile(dialogChoice?.filePaths[0]);
  }

  function executeImport(){
    if (!importFile) return alert("Select a valid import file")
    try{
      const dict = {};
      galeries.forEach((gal)=>{
        const {isEnabled, code, title, display, tabCode} = gal;
        dict[code] = {isEnabled, title, display, tabCode};
      });

      const importBuf = fs.readFileSync(importFile);
      const importGalleries = JSON.parse(importBuf);

      importGalleries.forEach(gal=>{
        const prepGal = {};

        if (dict[gal.code]){
          //description options
          (()=>{
            if(descriptionOption === "merge"){
              if (dict[gal.code].title) return prepGal["title"] = dict[gal.code].title;
              else return prepGal["title"] = gal.title;
            }
            if (descriptionOption === "replace") return prepGal["title"] = gal.title;
          })();

          //activity options
          (()=>{
            if(activityOption === "ignore") return prepGal["isEnabled"] = dict[gal.code].isEnabled;
            if(activityOption === "merge"){
              if (dict[gal.code].isEnabled) return prepGal["isEnabled"] = true;
              else return prepGal["isEnabled"] = gal.isEnabled;
            }
            if (activityOption === "replace") return prepGal["isEnabled"] = gal.isEnabled;
          })();

          //tabCode options
          (()=>{
            if(tabCodeOption === "ignore") return prepGal["tabCode"] = dict[gal.code].tabCode;
            if(tabCodeOption === "merge"){
              //tabcode could be empty at source so we are checking that
              if (dict[gal.code].tabCode) return prepGal["tabCode"] = dict[gal.code].tabCode;
              else return prepGal["tabCode"] = gal.tabCode;
            }
            if (tabCodeOption === "replace") return prepGal["tabCode"] = gal.tabCode;
          })();

          dict[gal.code] = prepGal;
        } else {
          if (tabCodeOption === "ignore") gal.tabCode = "";
          if (activityOption === "ignore") gal.isEnabled = false;

          const {isEnabled, title, display, tabCode} = gal;
          dict[gal.code] = {isEnabled, title, display, tabCode};
        }
      })

      const keys = Object.keys(dict);
      const updatedGalleries = [];
      keys.forEach(key=>{
        updatedGalleries.push({...dict[key], code:key} )
      });

      //fixing the display prop
      updatedGalleries.forEach(gal=>{
        if (gal.tabCode){
          gal["display"] = gal["title"] + " - " + gal["code"] + " - " + gal["tabCode"];
        } else {
          gal["display"] = gal["title"] + " - " + gal["code"];
        }
      })

      //removing duplicate tabCodes
      const seen = {};
      updatedGalleries.forEach(gal =>{
        if (seen[`${gal.tabCode}`]){
          gal.tabCode = "";
        }
        else seen[`${gal.tabCode}`] = true;
      });

      setGaleries(updatedGalleries);
      localStorage.setItem("galeries", JSON.stringify(updatedGalleries));
      alert("done");
      //force refresh
      setShowImportModal(false);
      setShowGalleries(false);
      //event loop hacks
      setTimeout(()=>{
        setShowGalleries(true);
      },0)
    } catch(err) {
      alert(err);
    }
  }

  return (
    <StyledModal isOpen={true} contentLabel="Import JSON">
      <Header>
        <div className="left-side">
          <p>Import JSON</p>
        </div>
        <div className="right-side">
          <h4
            style={{ display:"inline", cursor: 'pointer', flexShrink: '0', height: '100%' }}
            onClick={() => setShowImportModal(false)}
          >
            X
          </h4>
        </div>
      </Header>
        <button onClick={selectFile}>Select File</button>
        {importFile}
        <form onSubmit={(e)=>{
          e.preventDefault();
          executeImport();
        }}>
          <fieldset onChange={(e)=>setDescriptionOption(e.target.value)}>
            <legend>Description options</legend>
            <input required value="merge" id="descriptionMerge" name="description" type="radio" />
            <label htmlFor="descriptionMerge">Merge</label>
            <input required value="replace" id="descriptionReplace" name="description" type="radio" />
            <label htmlFor="descriptionReplace">Replace</label>
          </fieldset>

          <fieldset onChange={(e)=>setActivityOption(e.target.value)}>
            <legend>Activity options</legend>
            <input required value="ignore" id="actIgnore" name="activity" type="radio" />
            <label htmlFor="actIgnore">Ignore</label>
            <input required value="merge" id="actMerge" name="activity" type="radio" />
            <label htmlFor="actMerge">Merge</label>
            <input required value="replace" id="actReplace" name="activity" type="radio" />
            <label htmlFor="actReplace">Replace</label>
          </fieldset>

          <fieldset onChange={(e)=>setTabCodeOption(e.target.value)}>
            <legend>TabCode options</legend>
            <input required value="ignore" id="tabIgnore" name="tab" type="radio" />
            <label htmlFor="tabIgnore">Ignore</label>
            <input required value="merge" id="tabMerge" name="tab" type="radio" />
            <label htmlFor="tabMerge">Merge</label>
            <input required value="replace" id="tabReplace" name="tab" type="radio" />
            <label htmlFor="tabReplace">Replace</label>
          </fieldset>

          <button>Execute Import</button>
        </form>
    </StyledModal>
  )
}

const StyledModal = styled(ReactModal)`
  top: 50vh;
  left: 50vw;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 85vw;
  background-color: white;
  border: 1px solid black;
  user-select: none;
  position: absolute;
  z-index: 17;
  padding: 10px 10px 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  fieldset{
    outline: 1px solid #333;
    padding: 5px;

    legend{
      margin-bottom: 10px;
    }

    label{
      margin-right: 20px;
    }
  }

  .add-button{
    background-color: white;
    font-size: 12px;
    height: 25px;
    line-height: 18px;
    padding: 4px;
    border: 1px solid black;
    border-radius: 2px;
    font-family: Arial, Helvetica, sans-serif;
    width: 50%;
    margin-top: 5px;
    margin-left: auto;
    margin-right: auto;
    :hover{
      background-color: #848484;
    }
  }
`

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  line-height: 38px;
  color: #333;
  font-weight: bold;
  font-family: Oswald, 'sans-serif';
  margin-bottom: 8px;
  padding: 0 10px;
  word-break: break-all;
`
