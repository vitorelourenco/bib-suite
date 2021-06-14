import styled from 'styled-components';

export default function Button({children, ...rest}){
  return (
    <ButtonWrapper {...rest}>
      {children}
    </ButtonWrapper>
  )
}

const ButtonWrapper = styled.button`
  color: ${props=>{
    switch (props.variant){
      case "primary": return "white";
      default : return "white";
    }
  }};
  background-color: ${props=>{
    switch (props.variant){
      case "primary": return "#0275d8";
      default : return "white";
    }
  }};
  border: none;
  border-radius: 4px;
  padding: 0 10px;
`;