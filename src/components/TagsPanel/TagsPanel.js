import styled from 'styled-components'

import PicturesList from './PicturesList/PicturesList'
import { useState, useContext, useEffect } from 'react'
import FSConfig from './FSConfig'
import BibInput from './BibInput'
import CurrentImage from '../../contexts/CurrentImage'
import Images from '../../contexts/Images'
import BibList from './BibList'
import { Button } from '../Button'

export default function TagsPanel({inputRef}) {
  const {lastTag} = useContext(Images)
  const [picturesList, setPicturesList] = useState([]);
  const {currentImage} = useContext(CurrentImage);

  return (
    <TopWrapper>
      <FSConfig
        setPicturesList={setPicturesList}
      />
      <PicturesList inputRef={inputRef} picturesList={picturesList} />
      <p className="current-image">{currentImage}</p>
      <BibInput ref={inputRef} picturesList={picturesList}/>
      {lastTag?.length ? <p className="last-tag">spacebar sets:<br/> {lastTag.join(" ; ")}</p> : ""}
      <BibList></BibList>
      <Button className="export" variant="include">Export CSV</Button>
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

  .export{
    position: absolute;
    left: 0;
    bottom: 0px;
    width: 100%;
    border-radius: 0;
  }

  .last-tag{
    margin-top: 5px;
    margin-bottom: 5px;
    font-size: 12px;
    color: #333;
    word-break: break-word;
  }

  .current-image{
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
