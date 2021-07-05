import styled from "styled-components";
import TagRow from './TagRow';
export default function PicturesList({inputRef, picturesList}){
  return(
    <TopWrapper onClick={()=>inputRef?.current.focus()}>
      {picturesList.map(p=><TagRow picturesList={picturesList} key={p} picture={p}/>)}
    </TopWrapper>
  );
}

const TopWrapper = styled.ul`
  font-size: 12px;
  height: 250px;
  overflow-y: scroll;
  background-color: #457b9d;
  color: #f1faee;

  li:nth-child(odd){
    background-color: #1d3557;
  }
`;

