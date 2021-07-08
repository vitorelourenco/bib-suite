import styled from 'styled-components'
import { Button } from '../Button'
import ReactModal from 'react-modal'
import { useContext } from 'react'
import Images from '../../contexts/Images'

const electron = window.require('electron')
const remote = electron.remote
const { dialog } = remote

export default function GalleriesModal({ setShowGalleries }) {
  const { galeries, setGaleries } = useContext(Images)

  function ExitModal() {
    return (
      <>
        <p>Your galleries</p>
        <div>
          <Button variant="primary">Get JSON</Button>
          <Button style={{marginRight:"20px"}} variant="primary">Load JSON</Button>
          <h4
            style={{ display:"inline", cursor: 'pointer', flexShrink: '0', height: '100%' }}
            onClick={() => setShowGalleries(false)}
          >
            X
          </h4>
        </div>
      </>
    )
  }

  const activeGalleries = [];
  const inactiveGalleries = [];

  for (let i=0; i<galeries.length; i++){
    if (galeries[i].isEnabled){
      activeGalleries.push(galeries[i]);
    } else {
      inactiveGalleries.push(galeries[i]);
    }
  }


  return (
    <StyledModal isOpen={true} contentLabel="Galleries">
      <Header>
        <ExitModal />
      </Header>
      <p className="galleryActivity">Active galleries</p>
      <ul style={{ width: '100%' }} className="content">
        {activeGalleries.length === 0 ? (<p>None</p>) : <TableHeader />}
        {activeGalleries.map(galery => (
          <GaleryRow key={galery.code} galery={galery} />
        ))}
      </ul>
      <br />
      <p className="galleryActivity">Inactive galleries</p>
      <ul style={{ width: '100%' }} className="content">
        {inactiveGalleries.length === 0 ? (<p>None</p>) : <TableHeader />}
        {inactiveGalleries.map(galery => (
          <GaleryRow key={galery.code} galery={galery} />
        ))}
      </ul>
    </StyledModal>
  )
}

function GaleryRow(props) {
  const { galeries, setGaleries } = useContext(Images)
  const { isEnabled, title, code, tabCode } = props.galery

  function handleKeyDown(e, prop) {
    if (e.key === 'Enter') {
      props.galery[prop] = e.target.value
      setGaleries([...galeries])
      e.target.blur()
      localStorage.setItem("galeries", JSON.stringify(galeries))
    }
    if (e.key === 'Escape') {
      e.target.value = props.galery[prop]
      e.target.blur()
    }
  }

  return (
    <RowWrapper>
      <input
        onClick={() => {
          props.galery["isEnabled"] = !isEnabled
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
      />
      <input
        onKeyDown={e => handleKeyDown(e, 'code')}
        className="code"
        type="text"
        defaultValue={code}
      />
      <input
        onKeyDown={e => handleKeyDown(e, 'tabCode')}
        className="tabCode"
        type="text"
        defaultValue={tabCode}
      />
      <p className="delete" onClick={()=>{
        const choice = dialog.showMessageBoxSync(this, {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: `Delete gallery: ${code}?`
        })
        if (choice === 0){
          const index = galeries.indexOf(props.galery);
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
    flex: 0 0 20px;
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
    flex: 0 0 20px;
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

  button {
    width: 10ch;
    height: 4ch;
    :first-child {
      margin-right: 50px;
    }
  }

  .galleryActivity{
    text-decoration: underline;
  }

  p {
    word-break: break-word;
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
