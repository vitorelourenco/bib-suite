import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css'
import InnerImageZoom from 'react-inner-image-zoom'
import { useContext, useMemo } from 'react'
import CurrentImage from '../../contexts/CurrentImage'
import Images from '../../contexts/Images'
import styled from 'styled-components'

const fs = window.require('fs')

export default function ImagePanel() {
  const { currentImage } = useContext(CurrentImage)
  const { tags } = useContext(Images)
  const { highResImages, lowResImages } = useContext(Images)

  const existsLowRes = fs.existsSync(lowResImages[currentImage])
  const lowResFolder = document.querySelector(".FSOptions--lowResDir-show")?.textContent;

  const tagsLength = useMemo(()=>{
    return Object.keys(tags)?.length;
  },[tags]);

  return (
    <TopWrapper onClick={() => document.querySelector("#input-box").focus()}>
      {
        (()=>{
          if(tagsLength < 1){
            if (!lowResFolder) return "Waiting for low res folder..."
            else return "Waiting for CSV list...";
          } else {

            if (!existsLowRes){
              return `File ${currentImage} not found in low res folder ${lowResFolder}`;
            } else {
              return (<InnerImageZoom
                src={'file://' + lowResImages[currentImage]}
                zoomScale={2.5}
                zoomPreload={false}
                zoomSrc={
                  'file://' +
                  (highResImages[currentImage] || lowResImages[currentImage])
                }
              />);
            }
          }
        })()

      }
    </TopWrapper>
  )
}

const TopWrapper = styled.div`
  user-select: none;
  width: 100%;
  height: 100%;
  display: block;
  display: flex;
  justify-content: center;
  max-height: 100vh;

  .iiz {
    max-height: 100vh;
  }

  .iiz__img {
    max-height: 100vh;
  }
`
