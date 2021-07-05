import { Button, LeftButton, RightButton } from '../Button';
import { getDirAsync, saveFilePathAsync, getJPEGsFromFolder, getCSVPathAsync} from '../../helper_functions/fileHandling';
import { useContext, useState, useEffect} from 'react';
import Images from '../../contexts/Images';
import styled from 'styled-components';
import CurrentImage from '../../contexts/CurrentImage';

const fs = window.require('fs');
const pathModule = window.require('path')

const jpgRegExp = new RegExp(/(.jpg$)|(.JPG$)|(.jpeg$)|(.JPEG$)/);

export default function FSConfig({setPicturesList}){
  const {lowResImages, setLowResImages, setHighResImages, tags, setTags} = useContext(Images);
  const {currentImage, setCurrentImage} = useContext(CurrentImage);

  const [isHidden, setIsHidden] = useState(false);
  
  const [srcDir, setSrcDir] = useState("");
  const [highResDir, setHighResDir] = useState("");
  const [CSVFile, setCSVFile] = useState("");

  useEffect(()=>{
    const lowResPaths = getJPEGsFromFolder(srcDir);
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
    } catch (err) {
      console.log(err);
    }
  },[CSVFile]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TopWrapper isHidden={isHidden}>
        <Button
          className="FSOptions--lowResDir-set"
          variant="primary"
          onClick={() => getDirAsync().then(dir=>dir.setWith(setSrcDir))}
        >
          Set <strong>low res</strong> jpg dir
        </Button>
        <h4 className="FSOptions--lowResDir-show">{srcDir}</h4>

        <Button
          className="FSOptions--highResDir"
          disabled={srcDir?false:true}
          variant="primary"
          onClick={() => getDirAsync().then(dir=>dir.setWith(setHighResDir))}
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
              if (!file) return alert("Invalid File");
              if (file === CSVFile) return alert("Can't load the same file");
              setCSVFile(file);
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
              fs.writeFileSync(file.file+".csv","");
              const keys = Object.keys(lowResImages);
              keys.forEach(key=>{
                fs.appendFileSync(file.file+".csv", key+";\r\n", (err)=>{
                  if (err) return console.log(err);
                });
              });
              fs.appendFileSync(file.file+".csv", "\r\n", (err)=>{
                if (err) return console.log(err);
              });
              setCSVFile(file.file+".csv");
            });
          }}
        >
          New <strong>bare</strong> csv
        </RightButton>
        <h4>{CSVFile}</h4>

        <Button
          className="always-show"
          variant={isHidden ? "include" : "ditch"}
          onClick={() =>
            setIsHidden(!isHidden)
          }
        >
          {isHidden ? "Show FS Options" : "Hide FS Options"}
        </Button>
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

  .always-show{
    display: block;
  }
`;