import styled from 'styled-components'
import { useContext, useRef } from 'react'
import CurrentImage from '../../../contexts/CurrentImage'
import Images from '../../../contexts/Images';

export default function TagRow({ picture, picturesList }) {
  const { currentImage, setCurrentImage, setCurrentIndex } = useContext(CurrentImage);
  const {tags} = useContext(Images);
  const ref = useRef(null)

  return (
    <TopWrapper
      className={picture === currentImage ? 'current' : 'other'}
      id={picture}
      onClick={() => {
        const image = ref?.current?.textContent
        if (image) {
          setCurrentImage(image);
          setCurrentIndex(picturesList.indexOf(picture));
        }
      }}
    >
      <p ref={ref} className="left">
        {picture}
      </p>
      <p className="right">{tags[picture]?.join(";")}</p>
    </TopWrapper>
  )
}

const TopWrapper = styled.li`
  display: grid;
  grid-template-columns: 18ch 1fr;
  border-bottom: 1px solid #333;
  cursor: pointer;
  &:hover {
    font-size: 1.1em;
  }

  &.current {
    background-color: green !important;
    outline: 1px solid orange;
    font-weight: bold;
  }

  .left {
    border-right: 1px solid #333;
  }

  p {
    word-break: break-all;
    padding: 0.5ch;
  }
`
