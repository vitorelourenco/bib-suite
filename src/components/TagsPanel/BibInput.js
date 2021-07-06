import styled from 'styled-components'
import { useContext, forwardRef, useMemo } from 'react'
import CurrentImage from '../../contexts/CurrentImage'
import Images from '../../contexts/Images'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useState } from 'react'

export default function BibInput({picturesList}){
  const [value, setValue] = useState('')
  const [clock, setClock] = useState(true);

  const {
    currentImage,
    setCurrentImage,
    currentIndex,
    setCurrentIndex
  } = useContext(CurrentImage)
  const { lastTag, setLastTag, tags, setTags } = useContext(Images)

  function addTag(value) {
    if (tags[currentImage].includes(value)) {
      setValue('')
      return
    }
    if (value !== '') {
      tags[currentImage].push(value)
      setTags({ ...tags })
    } else {
      if (tags[currentImage].length > 0) setLastTag([...tags[currentImage]])
      next(currentIndex, picturesList.length - 1)
    }
    setValue('')
  }

  
  const okTime = useMemo(()=>{
    return Date.now();
  },[clock])

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault()
        if (e.repeat) {
          const timeAtRepeat = Date.now();
          if (timeAtRepeat-okTime > 25){
            next(currentIndex, picturesList.length - 1)
            setClock(!clock)
          }
          return
        }

        next(currentIndex, picturesList.length - 1)
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (e.repeat) {
          const timeAtRepeat = Date.now();
          if (timeAtRepeat-okTime > 25){
            previous(currentIndex, picturesList.length - 1)
            setClock(!clock)
          }
          return
        }

        previous(currentIndex, picturesList.length - 1)
        break
      }
      case 'Enter': {
        const node = document.querySelector('#input-box')
        const isBoxOpen = !!node.getAttribute('aria-activedescendant')
        console.log(isBoxOpen)
        if (isBoxOpen) return
        if (value === '' || Number.isInteger(parseFloat(value))) return addTag(value)
        if (galeries.map(galery=>galery.code).includes(value)) addTag(value)
        else {
          node.style.outline = "2px solid red";
          setTimeout(()=>{
            node.style.outline = "none";
          }, 300)
        }
        break
      }
      case ' ': {
        if (!/[a-z]/i.test(value)) e.preventDefault()
        if (lastTag.length !== 0 && value === '') {
          tags[currentImage] = [...lastTag]
          setTags({ ...tags })
          next(currentIndex, picturesList.length - 1)
        }
        break
      }
      case '-': {
        e.preventDefault()
        tags[currentImage].pop()
        setTags({ ...tags })
        break
      }
      default: {
        break
      }
    }
  }

  // Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
  const galeries = [
    {
      title: 'Specialized',
      code: 'specialized',
      display: 'Specialized - specialized'
    },
    { title: 'Pinarello', code: 'pinarello', display: 'Pinarello - pinarello' },
    { title: 'Touca Azul', code: 'ninaazu', display: 'Touca Azul - ninaazu' },
    {
      title: 'Equipe Elite',
      code: 'eqpelite',
      display: 'Equipe Elite - qpelite'
    },
    { title: 'Somos Do Bem', code: 'dubem', display: 'Somos do Bom - dubem' }
  ]

  function next(i, len) {
    if (i === len) return
    setCurrentIndex(currentIndex + 1)
    setCurrentImage(picturesList[currentIndex + 1])
  }

  function previous(i, len) {
    if (i === 0) return
    setCurrentIndex(currentIndex - 1)
    setCurrentImage(picturesList[currentIndex - 1])
  }

  const options = /[a-z]/i.test(value)
    ? galeries.map(option => option.display)
    : []

  return (
    <>
      <Autocomplete
        className="bib-input-box"
        id="input-box"
        freeSolo
        disableClearable
        autoHighlight={true}
        options={options}
        inputValue={value}
        onInputChange={(e, val) => {
          if (!e) return
          if (e.type === 'change') setValue(val)
          if (e.type === 'click') {
            const galery = galeries.find(galery => galery.display === val)
            addTag(galery.code)
          }
          if (e.key === 'Enter') {
            const galery = galeries.find(galery => galery.display === val)
            addTag(galery.code)
          }
        }}
        onKeyDown={e => handleKeyDown(e)}
        renderInput={params => (
          <TextField
            focused={true}
            {...params}
            label="bib or galery"
            margin="dense"
            variant="standard"
          />
        )}
      />
    </>
  )
}
