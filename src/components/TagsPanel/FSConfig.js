import { Button, LeftButton, RightButton } from '../Button';
import { getDirAsync, saveFilePathAsync, getJPEGsFromFolder, getCSVPathAsync, bareCSVfile} from '../../helper_functions/fileHandling';
import { useContext, useState, useEffect} from 'react';
import Images from '../../contexts/Images';
import styled from 'styled-components';
import CurrentImage from '../../contexts/CurrentImage';
import GalleriesModal from './GalleriesModal/GalleriesModal';

const fs = window.require('fs');
const pathModule = window.require('path')

const jpgRegExp = new RegExp(/(.jpg$)|(.JPG$)|(.jpeg$)|(.JPEG$)/);

export default function FSConfig({setPicturesList, setCSVFile, CSVFile, saveToFile}){
  const {lowResImages, setLowResImages, setHighResImages, tags, setTags} = useContext(Images);
  const {setCurrentImage, setCurrentIndex} = useContext(CurrentImage);

  const [isHidden, setIsHidden] = useState(false);
  
  const [srcDir, setSrcDir] = useState("");
  const [highResDir, setHighResDir] = useState("");
  const [inputCount, setInputCount] = useState(0);
  const [showGalleries, setShowGalleries] = useState(false);

  useEffect(()=>{
    const lowResPaths = getJPEGsFromFolder(srcDir);
    if (srcDir!=="" && lowResPaths?.length < 1) {
      setSrcDir("");
      alert(`No jpg-like images in ${srcDir}`);
      return;
    }
    const lowResImages = {};
    lowResPaths.forEach(path=>{
      const fullName = pathModule.basename(path);
      const name = fullName.replace(jpgRegExp, "");
      lowResImages[name] = path;
    })
    setLowResImages(lowResImages);
  },[srcDir]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    const highResPaths = getJPEGsFromFolder(highResDir);
    if (highResDir!=="" && highResPaths?.length < 1) {
      setHighResDir("");
      alert(`No jpg-like images in ${highResDir}`);
      return;
    }
    const highResImages = {};
    highResPaths.forEach(path=>{
      const fullName = pathModule.basename(path);
      const name = fullName.replace(jpgRegExp, "");
      highResImages[name] = path;    
    });
    setHighResImages(highResImages);
  },[highResDir]); // eslint-disable-line react-hooks/exhaustive-deps

  //loadcsv
  useEffect(()=>{
    const picturesList = [];
    const csvImages = {};
    try {
      const buf = fs.readFileSync(CSVFile);
      const csvStr = buf.toString().split("\r\n");
      if (csvStr.length < 1){
        alert("Empty CSV");
        return;
      }
      for (let i=0; i< csvStr.length; i++){
        const cells = csvStr[i].split(";")
        if (cells[0] === "") continue;
        const cellsSlice = cells.slice(1,);
        const filteredCells = cellsSlice.filter(elem=>elem!=="");
        csvImages[cells[0]] = filteredCells;
        picturesList.push(cells[0]);
      }
      setTags(csvImages);
      setPicturesList(picturesList);
      setCurrentImage(picturesList[0]);
      setCurrentIndex(0);
      setInputCount(0);
    } catch (err) {
      console.log(err);
      console.log("err at load csv")
    }
  },[CSVFile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(()=>{
    setInputCount(inputCount+1);
  },[tags])

  useEffect(()=>{
    if (!fs.existsSync(CSVFile)) return;
    if (inputCount > 100){
      saveToFile(CSVFile+"shadowcopy");
      saveToFile(CSVFile+"autobackup");
      fs.unlinkSync(CSVFile+"shadowcopy");
      setInputCount(0);
    }
  },[inputCount])

  console.log(showGalleries);
  return (
    <TopWrapper isHidden={isHidden}>
        <Button
          className="FSOptions--lowResDir-set"
          variant="primary"
          onClick={() => getDirAsync().then(dir=>{if(dir) setSrcDir(dir)})}
        >
          Set <strong>low res</strong> jpg dir
        </Button>
        <h4 className="FSOptions--lowResDir-show">{srcDir}</h4>

        <Button
          className="FSOptions--highResDir"
          disabled={srcDir?false:true}
          variant="primary"
          onClick={() => getDirAsync().then(dir=>{if(dir) setHighResDir(dir)})}
        >
          Set <strong>high res</strong> jpg dir
        </Button>
        <h4>{highResDir}</h4>

        <LeftButton
          variant="primary"
          disabled={srcDir?false:true}
          onClick={() =>{
            getCSVPathAsync()
            .then(file=>{
              if (!file) return;
              if (file === CSVFile) return alert("Can't load the same file");
              setCSVFile(file);
              document.querySelector("#input-box").focus();
            });
          }}
        >
          <strong>Load</strong> csv
        </LeftButton>
        <RightButton
          disabled={srcDir?false:true}
          variant="primary"
          onClick={() => {
            saveFilePathAsync()
            .then(file=>{
              if (!file) return;
              if (file === CSVFile) return alert("Can't overwrite the same file");
              bareCSVfile(file, lowResImages);
              setCSVFile(file);
              document.querySelector("#input-box").focus();
            });
          }}
        >
          New <strong>bare</strong> csv
        </RightButton>
        <h4>{CSVFile}</h4>

        <Button
          className="showGalleries"
          variant="primary"
          onClick={()=>setShowGalleries(true)}
        >
          Galleries
        </Button>

        <Button
          className="always-show"
          variant={isHidden ? "include" : "ditch"}
          onClick={() =>
            setIsHidden(!isHidden)
          }
        >
          {isHidden ? "Show FS Options" : "Hide FS Options"}
        </Button>
        {showGalleries ? (
          <GalleriesModal
            setShowGalleries={setShowGalleries}
          />
          ) : (
            ''
        )}
      </TopWrapper>
  )
}

const TopWrapper = styled.div`
  border-radius: 6px;
  margin-bottom: 10px;
  box-shadow: 0 0 3px rgba(0,0,0, 0.5);
  background-color: #eee;
  button, h4{
    display: ${props=>props.isHidden ? "none" : ""};
  }
  .showGalleries{
    margin-bottom: 10px;
  }
  .always-show{
    display: block;
  }
`;