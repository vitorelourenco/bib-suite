import { useContext, useEffect, useMemo } from 'react'
import CurrentImage from '../../contexts/CurrentImage'
import Images from '../../contexts/Images'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useState } from 'react'
import styled from 'styled-components'

export default function BibInput({ picturesList }) {
  const [value, setValue] = useState('')
  const [clock, setClock] = useState(true)
  const { galeries } = useContext(Images)
  const [isDisabled, setIsDisabled] = useState(true)
  const [tabCallsNext, setTabCallsNext] = useState(false)

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

  useEffect(() => {
    if (picturesList?.length) {
      setIsDisabled(false)
    }
  }, [picturesList])

  const okTime = useMemo(() => {
    return Date.now()
  }, [clock])

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault()
        if (e.repeat) {
          const timeAtRepeat = Date.now()
          if (timeAtRepeat - okTime > 100) {
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
          const timeAtRepeat = Date.now()
          if (timeAtRepeat - okTime > 100) {
            previous(currentIndex, picturesList.length - 1)
            setClock(!clock)
          }
          return
        }

        previous(currentIndex, picturesList.length - 1)
        break
      }
      case 'Enter': {
        if (isDisabled) return
        if (e.repeat) return
        const node = document.querySelector('#input-box')
        const isBoxOpen = !!node.getAttribute('aria-activedescendant')
        if (isBoxOpen) return
        if (value === '' || !/[^0-9]/.test(value)) return addTag(value)
        if (galeries.map(galery => galery.code).includes(value)) addTag(value)
        else {
          node.style.outline = '2px solid red'
          setTimeout(() => {
            node.style.outline = 'none'
          }, 300)
        }
        break
      }
      case ' ': {
        if (!/[^0-9]/.test(value)) e.preventDefault()
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
      case 'Tab': {
        e.preventDefault();
        if (e.target.value === "") return;
        const galery = galeries.find(
          galery => galery.tabCode === e.target.value
        )
        if (galery) {
          addTag(galery.code)
          if(tabCallsNext) {
            setLastTag(tags[currentImage]);
            next(currentIndex, picturesList.length - 1)
          }
        } else {
          const node = document.querySelector('#input-box')
          node.style.outline = '2px solid red'
          setTimeout(() => {
            node.style.outline = 'none'
          }, 300)
        }
        break
      }
      default: {
        break
      }
    }
  }

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

  const options = /[^0-9]/.test(value)
    ? galeries.filter(galery => galery.isEnabled).map(galery => galery.display)
    : []

  return (
    <>
      <Autocomplete
        className="bib-input-box"
        id="input-box"
        freeSolo
        autoHighlight={true}
        disableClearable
        options={options}
        inputValue={value}
        onInputChange={(e, val) => {
          if (isDisabled) return
          if (!e) return
          if (e.type === 'change') setValue(val)
          if (e.type === 'click') {
            const galery = galeries.find(galery => galery.display === val)
            addTag(galery.code)
          }
          if (e.key === 'Enter') {
            const galeryValue = galeries.find(galery => galery.code === value)
            if (galeryValue) return addTag(galeryValue.code)
            const galery = galeries.find(galery => galery.display === val)
            addTag(galery.code)
          }
        }}
        onKeyDown={e => handleKeyDown(e)}
        renderInput={params => (
          <TextField
            disabled={isDisabled}
            focused={!isDisabled}
            {...params}
            label="bib or galery"
            margin="dense"
            variant="standard"
          />
        )}
      />
      <TabBehaviours
        tabCallsNext={tabCallsNext}
        setTabCallsNext={setTabCallsNext}
      />
    </>
  )
}

function TabBehaviours({ tabCallsNext, setTabCallsNext }) {
  return (
    <TabWrapper>
      <label style={{ fontSize: '12px' }} htmlFor="tabSkipper">
        Tab calls next
      </label>
      <input
        onChange={() => {
          setTabCallsNext(!tabCallsNext)
        }}
        checked={tabCallsNext}
        type="checkbox"
      />
    </TabWrapper>
  )
}

const TabWrapper = styled.div`
  gap: 5px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
`
