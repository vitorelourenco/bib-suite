import styled from 'styled-components'
import { useContext, forwardRef } from 'react'
import CurrentImage from '../../contexts/CurrentImage'
import Images from '../../contexts/Images'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useState } from 'react'
const BibInput = forwardRef(({ picturesList }, ref) => {
  const [value, setValue] = useState('')

  const {
    currentImage,
    setCurrentImage,
    currentIndex,
    setCurrentIndex
  } = useContext(CurrentImage)
  const { lastTag, setLastTag, tags, setTags } = useContext(Images)

  function handleKeyDown(e) {
    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault()
        if (e.repeat) return
        next(currentIndex, picturesList.length - 1)
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (e.repeat) return
        previous(currentIndex, picturesList.length - 1)
        break
      }
      case 'Enter': {
        if (tags[currentImage].includes(value)) {
          return
        }
        if (value !== '') {
          tags[currentImage].push(value)
          setTags({ ...tags })
        } else {
          setLastTag([...tags[currentImage]])
          next(currentIndex, picturesList.length - 1)
        }
        setValue('')
        break
      }
      case ' ': {
        e.preventDefault()
        if (lastTag !== []) {
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
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 }
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

  return (
    <>
      <TopWrapper
        value={value}
        onChange={e => setValue(e.target.value)}
        ref={ref}
        onKeyDown={e => handleKeyDown(e)}
      />
    </>
  )
})

const TopWrapper = styled.input`
  width: 100%;
`

export default BibInput
