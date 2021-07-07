import styled from 'styled-components'
import TagRow from './TagRow'
import React from 'react';
import { useMemo } from 'react';

export default function PicturesList({
  setCurrentImage,
  setCurrentIndex,
  currentImage,
  tags,
  picturesList,
  currentIndex
}) {

  const inc = 50;

  const range = useMemo(()=>{
    const arr = [];
    let counter = -1;
    while (counter <= picturesList.length){
      arr.push([counter+1, counter+inc])
      counter += inc;
    }
    return arr;
  },[picturesList]);

  return (
    <TopWrapper onClick={() => document.querySelector('#input-box').focus()}>
      {
        range.map(subRange => {
          return (
            <MemoizedSubList
              key={subRange}
              setCurrentImage={setCurrentImage}
              setCurrentIndex={setCurrentIndex}
              currentImage={currentImage}
              tags={tags}
              picturesList={picturesList}
              subRange={subRange}
              isActive={currentIndex<=subRange[1] && currentIndex>=subRange[0]}
            />
          )
        })
      }

    </TopWrapper>
  )
}

const MemoizedSubList = React.memo(SubList,(prevProps, nextProps)=>{
  if (prevProps.picturesList !== nextProps.picturesList) return false;
  if (nextProps.isActive) return false;
  if (prevProps.isActive !== nextProps.isActive) return false;
  return true;
});

function SubList({
  setCurrentImage,
  setCurrentIndex,
  currentImage,
  tags,
  picturesList,
  isActive,
  subRange
}) {
  return (
    <>
      {picturesList.slice(subRange[0],subRange[1]+1).map(p => {
        return (
          <TagRow
            setCurrentImage={setCurrentImage}
            setCurrentIndex={setCurrentIndex}
            isCurrentImage={currentImage === p}
            tagsOfPicture={tags[p]}
            tagsString={JSON.stringify(tags[p])}
            picturesList={picturesList}
            key={p}
            picture={p}
          />
        )
      })}
    </>
  )
}

const TopWrapper = styled.ul`
  font-size: 12px;
  height: 250px;
  overflow-y: scroll;
  background-color: #457b9d;
  color: #f1faee;

  li:nth-child(odd) {
    background-color: #1d3557;
  }
`
