import GlobalStyles from './styles/GlobalStyles';
import TagsPanel from './components/TagsPanel/TagsPanel';
import CurrentImage from './contexts/CurrentImage';
import styled from 'styled-components';
import ImagePanel from './components/ImagePanel/ImagePanel';
import {useState, useRef, useEffect} from 'react';
import Images from './contexts/Images';
import Modal from "react-modal";
import defaultGaleries from './defaultGaleries';

const app = window.require('electron').remote.app
const fs = window.require('fs');
const path = window.require('path')
const isDev = window.require('electron-is-dev')

Modal.setAppElement(document.querySelector("#root"));

function App() {
  const [highResImages, setHighResImages] = useState({});
  const [lowResImages, setLowResImages] = useState({});
  const [currentImage, setCurrentImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [lastTag, setLastTag] = useState([]);
  const [galeries, setGaleries] = useState([]);
  const [tags, setTags] = useState({})
  const inputRef = useRef(null);

  useEffect(()=>{
    const row = document.querySelector(`#${currentImage}`);
    row?.scrollIntoView({block:"nearest"});
  },[currentImage]);

  useEffect(()=>{
    const lsGaleries = localStorage.getItem("galeries");
    if (lsGaleries === null){
      localStorage.setItem("galeries", JSON.stringify(defaultGaleries));
      setGaleries(defaultGaleries);
    } else {
      setGaleries(JSON.parse(lsGaleries));
    }
  },[])
  console.log(galeries);
  console.log("banana");

  return (
    <CurrentImage.Provider value={{currentImage, setCurrentImage, currentIndex, setCurrentIndex}}>
      <Images.Provider value={{galeries, setGaleries, lastTag, setLastTag, tags, setTags, lowResImages, setLowResImages, highResImages, setHighResImages}}>
        <GlobalStyles />
        <TopWrapper>
          <ImagePanel inputRef={inputRef}/>
          <TagsPanel inputRef={inputRef}/>
        </TopWrapper>
      </Images.Provider>
    </CurrentImage.Provider>
  );
}

export default App;

const TopWrapper = styled.main`
  display: flex;
`;