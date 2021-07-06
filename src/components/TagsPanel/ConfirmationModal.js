import ReactModal from 'react-modal'
import styled from 'styled-components'
import { Button } from '../Button'

ReactModal.defaultStyles.overlay.zIndex = 15
ReactModal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.6)'

export default function CheckoutModal({
  CSVFile,
  saveToFile,
  setShowConfirmation
}) {
  function ExitModal() {
    return (
      <h4
        style={{ cursor: 'pointer', flexShrink: '0', height: '100%' }}
        onClick={() => setShowConfirmation(false)}
      >
        X
      </h4>
    )
  }

  return (
    <StyledModal isOpen={true} contentLabel="Checkout">
      <Header>
        <ExitModal />
      </Header>
      <p>
        File <strong>{`${CSVFile}`}</strong> will be{' '}
        <strong>{`overwritten`}</strong> with the current data{' '}
      </p>
      <div>
        <Button
          onClick={() => {
            saveToFile()
            alert("done");
            setShowConfirmation(false)
          }}
          variant="include"
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            setShowConfirmation(false)
          }}
          variant="ditch"
        >
          Cancel
        </Button>
      </div>
    </StyledModal>
  )
}

const StyledModal = styled(ReactModal)`
  top: 50vh;
  left: 50vw;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  max-width: 790px;
  width: 100%;
  background-color: #eee;
  border: 1px solid black;
  border-radius: 20px;
  user-select: none;
  position: absolute;
  z-index: 16;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 600px;

  button {
    width: 10ch;
    height: 4ch;
    :first-child {
      margin-right: 50px;
    }
  }

  p {
    word-break: break-word;
  }
`

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
  line-height: 38px;
  color: #333;
  font-weight: bold;
  font-family: Oswald, 'sans-serif';
  margin-bottom: 8px;
  padding: 0 10px;
  word-break: break-all;
`
