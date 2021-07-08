import styled from 'styled-components'
import { Button } from '../../Button'
import ReactModal from 'react-modal'
import { useContext, useState } from 'react'
import Images from '../../../contexts/Images'
import AddGalleryModal from './AddGalleryModal';

const electron = window.require('electron')
const remote = electron.remote
const { dialog } = remote

export default function GalleriesModal({ setShowGalleries }) {
  const { galeries, setGaleries } = useContext(Images)
  const [filter, setFilter] = useState("");
  const [showAddGallery, setShowAddGallery] = useState(false);

  const activeGalleries = [];
  const inactiveGalleries = [];

  for (let i=0; i<galeries.length; i++){
    if (galeries[i].isEnabled){
      activeGalleries.push(galeries[i]);
    } else {
      inactiveGalleries.push(galeries[i]);
    }
  }

  const filterRegExp = new RegExp(filter,"i")
  const filteredActiveGalleries = activeGalleries.filter((gallery)=>{
    if (filterRegExp.test(gallery.display)){
      return true;
    }
    return false;
  });
  const filteredInactiveGalleries = inactiveGalleries.filter((gallery)=>{
    if (filterRegExp.test(gallery.display)){
      return true;
    }
    return false;
  });


  return (
    <StyledModal isOpen={true} contentLabel="Galleries">
      <Header>
        <div className="left-side">
          <div>
            <p style={{display:"inline-block", marginRight:"10px"}}>Your galleries</p>
            <button onClick={()=>setShowAddGallery(true)} className="JSONButton">Add gallery</button>
          </div>
        <label htmlFor="filter">Search: </label>
          <input id="filter" value={filter} onChange={(e)=>{setFilter(e.target.value)}} />
        </div>
        <div className="right-side">
          <button className="JSONButton">Export JSON</button>
          <button className="JSONButton" style={{marginRight:"20px"}}>Import JSON</button>
          <h4
            style={{ display:"inline", cursor: 'pointer', flexShrink: '0', height: '100%' }}
            onClick={() => setShowGalleries(false)}
          >
            X
          </h4>
        </div>
      </Header>
      <p className="galleryActivity">Active galleries</p>
      <ul style={{ width: '100%' }} className="content">
        {filteredActiveGalleries.length === 0 ? (<p>None</p>) : <TableHeader />}
        {filteredActiveGalleries.map((gallery) => (
          <GalleryRow key={gallery.code} gallery={gallery} />
        ))}
      </ul>
      <br />
      <p className="galleryActivity">Inactive galleries</p>
      <ul style={{ width: '100%' }} className="content">
        {filteredInactiveGalleries.length === 0 ? (<p>None</p>) : <TableHeader />}
        {filteredInactiveGalleries.map(gallery => (
          <GalleryRow key={gallery.code} gallery={gallery} />
        ))}
      </ul>
      {showAddGallery ? (
        <AddGalleryModal
          setShowAddGallery={setShowAddGallery}
        />
        ) : (
          ''
      )}
    </StyledModal>
  )
}

function GalleryRow(props) {
  const { galeries, setGaleries } = useContext(Images)
  const { isEnabled, title, code, tabCode } = props.gallery
  const gallery = props.gallery;

  function updateDisplayProp(){
    gallery["display"] = gallery["title"] + " - " + gallery["code"];
    if (gallery["tabCode"]){
      gallery["display"] += " - " + gallery["tabCode"]
    }
  }

  function handleKeyDown(e, prop) {
    if (e.key === 'Enter') {
      if (e.target.value !== gallery[prop]){
        gallery[prop] = e.target.value
        localStorage.setItem("galeries", JSON.stringify(galeries))
        e.target.style.background = "GreenYellow";
        window.document.body.style.pointerEvents = "none";
        setTimeout(() => {
          e.target.style.background = "white";
          setGaleries([...galeries])
          window.document.body.style.pointerEvents = "initial";
        }, 300)
        updateDisplayProp();
      }
      e.target.blur()
    }

    if (e.key === 'Escape') {
      if (e.target.value !== gallery[prop]){
        e.target.style.background = "IndianRed";
        setTimeout(() => {
          e.target.style.background = "white";
        }, 300)
      }
      e.target.value = gallery[prop];
      e.target.blur()
    }
  }

  function handleClickOutside(e,prop){
    if (!e.relatedTarget) return;
    if (e.target.value !== gallery[prop]){
      e.target.style.background = "IndianRed";
      setTimeout(() => {
        e.target.style.background = "white";
      }, 300)
    }
    e.target.value = gallery[prop];
  }

  return (
    <RowWrapper>
      <input
        onClick={() => {
          gallery["isEnabled"] = !isEnabled
          setGaleries([...galeries])
          localStorage.setItem("galeries", JSON.stringify(galeries))
        }}
        className="checkbox"
        defaultChecked={isEnabled}
        type="checkbox"
      />
      <input
        onKeyDown={e => handleKeyDown(e, 'title')}
        className="title"
        type="text"
        defaultValue={title}
        onBlur={(e)=>handleClickOutside(e, "title")}
      />
      <input
        onKeyDown={e => handleKeyDown(e, 'code')}
        className="code"
        type="text"
        defaultValue={code}
        onBlur={(e)=>handleClickOutside(e, "code")}
      />
      <input
        onKeyDown={e => handleKeyDown(e, 'tabCode')}
        className="tabCode"
        type="text"
        defaultValue={tabCode}
        onBlur={(e)=>handleClickOutside(e, "tabCode")}

      />
      <p className="delete" onClick={()=>{
        const choice = dialog.showMessageBoxSync(this, {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: `Delete gallery: ${code}?`
        })
        if (choice === 0){
          const index = galeries.indexOf(gallery);
          galeries.splice(index,1);
          setGaleries([...galeries]);
          localStorage.setItem("galeries", JSON.stringify(galeries))
        }
      }}>x</p>
    </RowWrapper>
  )
}

function TableHeader() {
  return (
    <TableHeaderWrapper>
      <p className="checkbox"></p>
      <p className="title">Description</p>
      <p className="code">Code</p>
      <p className="tabCode">TabCode</p>
      <p className="delete"></p>
    </TableHeaderWrapper>
  )
}

const TableHeaderWrapper = styled.li`
  display: flex;
  width: 100%;
  .title {
    flex: 1 1 50%;
  }
  .code {
    flex: 0 0 20%;
  }
  .tabCode {
    flex: 0 0 15%;
  }
  .checkbox {
    flex: 0 0 30px;
    height: 20px;
  }
  .delete {
    color: red;
    margin-left: 5px;
    flex: 0 0 15px;
    cursor: pointer;
  }
`

const RowWrapper = styled.li`
  display: flex;
  align-items: center;

  [type='text'] {
    width: 100%;
    border-radius: 0;
    border-style: solid;
    border: none;
    outline: 1px solid #333;

    :hover {
      background-color: #eee;
    }

    :not(:focus) {
      cursor: pointer;
    }
  }

  .checkbox {
    flex: 0 0 30px;
    transform: scale(1.6)
  }
  .title {
    flex: 1 1 50%;
  }
  .code {
    flex: 0 0 20%;
  }
  .tabCode {
    flex: 0 0 15%;
  }
  .delete {
    color: red;
    margin-left: 5px;
    flex: 0 0 15px;
    cursor: pointer;
  }
`

const StyledModal = styled(ReactModal)`
  top: 50vh;
  left: 50vw;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  max-width: 90vw;
  height: 90vh;
  width: 100%;
  background-color: #eee;
  border: 1px solid black;
  user-select: none;
  position: absolute;
  z-index: 16;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow-y: scroll;

  .galleryActivity{
    text-decoration: underline;
  }

  p {
    word-break: break-word;
  }

  label{
    margin-right: 5px;
    font-size: 14px;
  }

  #filter{
    height: 30px;
    width: 150px;
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

  .left-side{
    flex-grow: 1;
    flex-shrink: 1;
  }

  .right-side{
    flex-grow: 0;
    flex-shrink: 0;
  }

  .JSONButton{
    background-color: white;
    font-size: 12px;
    height: 25px;
    line-height: 18px;
    padding: 4px;
    border: 1px solid black;
    border-radius: 2px;
    margin-right: 20px;

    :hover{
      background-color: #848484;
    }
  }
`
