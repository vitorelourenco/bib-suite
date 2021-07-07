import styled from "styled-components"
import CurrentImage from '../../contexts/CurrentImage';
import { useContext } from "react";
import Images from "../../contexts/Images";

export default function BibList(){
  const {currentImage} = useContext(CurrentImage);
  const {tags, setTags} = useContext(Images);


  function Tag({tag}){

    function deleteTag(){
      const index = tags[currentImage].indexOf(tag);
      tags[currentImage].splice(index,1);
      setTags({...tags});
    }
  
    return (
      <TagWrapper onClick={deleteTag}>
        {tag}
      </TagWrapper>
    );
  }

  return (
    <TopWrapper>
      {
        tags[currentImage]
        ? tags[currentImage].map(tag => <Tag tag={tag} key={tag} />)
        : ""
      }
    </TopWrapper>
  );
}



const TopWrapper = styled.ul`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TagWrapper = styled.li`
  padding: 5px;
  background-color: #333;
  color: white;
  position: relative;
  cursor: pointer;
  border-radius: 4px;
  height: 3ch;

  :hover{
    opacity: 50%;
  }

  :hover::before{
    content:"x";
    color: red;
    position: absolute;
    background-color: white;
    display: block;
    width: 2ch;
    height: 2ch;
    line-height: 2ch;
    text-align: center;
    border-radius: 50%;
    top: -10px;
    left: -5px;
  }
`;