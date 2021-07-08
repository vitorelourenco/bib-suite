import styled from 'styled-components'
import { Button } from '../../Button'
import ReactModal from 'react-modal'
import { useContext, useState } from 'react'
import Images from '../../../contexts/Images'
import { useRef } from 'react'
import { useEffect } from 'react'

export default function GalleriesModal({ setShowAddGallery }) {
  return (
    <StyledModal isOpen={true} contentLabel="Galleries">
      <Header>
        <div className="left-side">
          <p>New gallery</p>
        </div>
        <div className="right-side">
          <h4
            style={{ display:"inline", cursor: 'pointer', flexShrink: '0', height: '100%' }}
            onClick={() => setShowAddGallery(false)}
          >
            X
          </h4>
        </div>
      </Header>
        <form onSubmit={(e)=>e.preventDefault()}>
        <ul style={{width: "100%", padding:"12px"}}>
          <TableHeader/>
          <GalleryRow setShowAddGallery={setShowAddGallery}/>
        </ul>
        </form>
    </StyledModal>
  )
}

function GalleryRow({setShowAddGallery}) {
  const ref = useRef(null);
  
  const { galeries, setGaleries } = useContext(Images);

  const [gallery, setGallery] = useState({
    isEnabled:true,
    title:"",
    code:"",
    tabCode:"",
    display:""
  });

  function updateDisplayProp(){
    gallery["display"] = gallery["title"] + " - " + gallery["code"];
    if (gallery["tabCode"]){
      gallery["display"] += " - " + gallery["tabCode"]
    }
  }

  function handleAddGallery(){
    const codes = [];
    const tabCodes = []
    
    for (let i=0; i<galeries.length; i++){
      codes.push(galeries[i].code);
      tabCodes.push(galeries[i].tabCode);
    }

    if (gallery.title === "") return alert("Description can't be empty");
    if (gallery.code === "") return alert("Code can't be empty");
    if (codes.includes(gallery.code)) return alert("Code is already being used");
    if (gallery.tabCode !== "" && tabCodes.includes(gallery.tabCode)) return alert("TabCode is already being used");

    galeries.unshift(gallery);
    localStorage.setItem("galeries", JSON.stringify(galeries))
    setGaleries([...galeries]);
    setShowAddGallery(false);
  }

  useEffect(()=>{
    ref.current?.focus();
  },[ref])

  return (
    <>
    <RowWrapper>
      <input
        ref={ref}
        className="title"
        type="text"
        value={gallery.title}
        onChange={(e)=>{
          gallery.title = e.target.value;
          updateDisplayProp();
          setGallery({...gallery})
        }}
      />
      <input
        className="code"
        type="text"
        value={gallery.code}
        onChange={(e)=>{
          gallery.code = e.target.value;
          updateDisplayProp();
          setGallery({...gallery})
        }}
      />
      <input
        className="tabCode"
        type="text"
        value={gallery.tabCode}
        onChange={(e)=>{
          gallery.tabCode = e.target.value;
          updateDisplayProp();
          setGallery({...gallery})
        }}
      />
    </RowWrapper>
    <li className="add-button-li"><button onClick={()=>handleAddGallery()}className="add-button">Add gallery</button></li>
    </>
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
  margin-bottom: 5px;
  .title {
    flex: 1 1 60%;
  }
  .code {
    flex: 0 0 20%;
  }
  .tabCode {
    flex: 0 0 20%;
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
    background-color: #eee;

    :hover {
      background-color: white;
    }

    :not(:focus) {
      cursor: pointer;
    }

    :focus{
      background-color: white;
    }
  }

  .title {
    flex: 1 1 60%;
  }
  .code {
    flex: 0 0 20%;
  }
  .tabCode {
    flex: 0 0 20%;
  }
`

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

  .add-button-li{
    display: flex;
    justify-content: center;
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
