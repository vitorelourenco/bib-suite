import styled from 'styled-components'
import React, { useRef } from 'react'

function TagRow(props) {
  const {setCurrentImage, setCurrentIndex, isCurrentImage, tagsOfPicture, picture, picturesList, tagsString} = props;
  const ref = useRef(null)

  return (
    <TopWrapper
      className={isCurrentImage ? 'current' : 'other'}
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
      <p className="right">{tagsOfPicture?.join(";")}</p>
    </TopWrapper>
  )
}

const MemoizedTagRow = React.memo(TagRow, (prevProps, nextProps)=>{
  if (prevProps.isCurrentImage !== nextProps.isCurrentImage) return false;
  if (prevProps.tagsString !== nextProps.tagsString) return false;
  return true;
});

export default MemoizedTagRow;

const TopWrapper = styled.li`
  display: grid;
  grid-template-columns: 18ch 1fr;
  border-bottom: 1px solid #333;
  cursor: pointer;

  &.current {
    background-color: green !important;
    outline: 1px solid orange;
  }

  .left {
    border-right: 1px solid #333;
  }

  p {
    word-break: break-all;
    padding: 0.5ch;
  }
`
