import styled from 'styled-components'

import PicturesList from './PicturesList/PicturesList'
import { useState, useContext } from 'react'
import FSConfig from './FSConfig'
import BibInput from './BibInput'
import CurrentImage from '../../contexts/CurrentImage'
import Images from '../../contexts/Images'
import BibList from './BibList'
import { Button } from '../Button'
import ConfirmationModal from './ConfirmationModal'
import { saveFilePathAsync } from '../../helper_functions/fileHandling'
const fs = window.require('fs')

export default function TagsPanel() {
  const { lastTag, tags } = useContext(Images)
  const [picturesList, setPicturesList] = useState([])
  const { currentImage, setCurrentImage, setCurrentIndex, currentIndex } = useContext(
    CurrentImage
  )
  const [CSVFile, setCSVFile] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  function saveToFile(path) {
    const keys = Object.keys(tags)
    let CSVString = ''
    keys.forEach(key => {
      CSVString += [key, ...tags[key]].join(';') + ';\r\n'
    })
    fs.writeFileSync(path, CSVString)
  }

  function exportCleanCSV(){
    saveFilePathAsync().then(path=>{
      const keys = Object.keys(tags)
      let CSVString = ''
      keys.forEach(key => {
        if (tags[key].length !== 0){
          CSVString += [key, ...tags[key]].join(';') + ';\r\n';
        }
      })
      fs.writeFileSync(path, CSVString)
      alert("done");
    }).catch(err=>alert(err))
  }

  return (
    <TopWrapper>
      <FSConfig
        setPicturesList={setPicturesList}
        setCSVFile={setCSVFile}
        CSVFile={CSVFile}
        saveToFile={saveToFile}
      />
      <PicturesList
        setCurrentImage={setCurrentImage}
        setCurrentIndex={setCurrentIndex}
        currentIndex={currentIndex}
        currentImage={currentImage}
        tags={tags}
        picturesList={picturesList}
      />
      <p className="current-image">{currentImage}</p>
      <BibInput picturesList={picturesList} />
      {lastTag?.length ? (
        <p className="last-tag">
          spacebar sets:
          <br /> {lastTag.join(' ; ')}
        </p>
      ) : (
        ''
      )}
      <BibList></BibList>

      <Button
        onClick={exportCleanCSV}
        className="export"
        variant="include"
      >
        Export <strong>clean</strong> CSV
      </Button>

      <Button
        onClick={() => setShowConfirmation(true)}
        className="save"
        variant="include"
      >
        Save to current CSV
      </Button>
      {showConfirmation ? (
        <ConfirmationModal
          CSVFile={CSVFile}
          saveToFile={saveToFile}
          setShowConfirmation={setShowConfirmation}
        />
      ) : (
        ''
      )}
    </TopWrapper>
  )
}

const TopWrapper = styled.div`
  height: 100vh;
  padding: 5px 5px 30px 5px;
  width: 280px;
  flex: 0 0 280px;
  position: relative;
  @media (max-height: 700px) {
    overflow-y: scroll;
  }

  .save {
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    border-radius: 0;
  }

  .export {
    position: absolute;
    left: 0;
    bottom: 28px;
    width: 100%;
    border-radius: 0;
  }

  .last-tag {
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 12px;
    color: #333;
    word-break: break-word;
  }

  .current-image {
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
  }

  h4 {
    font-size: 12px;
    word-break: break-all;
    margin: 3px 3px 10px 3px;
  }
`
