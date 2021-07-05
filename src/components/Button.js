import styled from 'styled-components';

export function Button({children, ...rest}){
  return (
    <ButtonWrapper {...rest}>
      {children}
    </ButtonWrapper>
  )
}

const ButtonWrapper = styled.button`
  color: ${props=>{
    switch (props.variant){
      case "primary": return "#F1FAEE";
      default : return "#F1FAEE";
    }
  }};
  
  background-color: ${props=>{
    switch (props.variant){
      case "primary": return "#457B9D";
      case "ditch": return "#d4a1a5";
      case "include": return "#809966";
      default : return "#F1FAEE";
    }
  }};

  border: none;
  border-radius: 4px;
  padding: 3px 10px;
  width: 100%;
  &:hover{
    filter: brightness(1.2);
  }
  :disabled{
    filter: brightness(0.5);
    cursor: auto;
    :hover{
      filter: brightness(0.5);
    }
  }
`;

export function LeftButton({children, ...rest}){
  return (
    <LeftButtonWrapper {...rest}>
      {children}
    </LeftButtonWrapper>
  )
}

const LeftButtonWrapper = styled.button`
  color: ${props=>{
    switch (props.variant){
      case "primary": return "#F1FAEE";
      default : return "#F1FAEE";
    }
  }};
  background-color: ${props=>{
    switch (props.variant){
      case "primary": return "#457B9D";
      default : return "#white";
    }
  }};
  border: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right: 1px solid #F1FAEE;
  padding: 3px 5px;
  width: 50%;
  &:hover{
    filter: brightness(1.2);
  }
  :disabled{
    filter: brightness(0.5);
    cursor: auto;
    :hover{
      filter: brightness(0.5);
    }
  }
`;

export function RightButton({children, ...rest}){
  return (
    <RightButtonWrapper {...rest}>
      {children}
    </RightButtonWrapper>
  )
}

const RightButtonWrapper = styled.button`
  color: ${props=>{
    switch (props.variant){
      case "primary": return "#F1FAEE";
      default : return "#F1FAEE";
    }
  }};
  background-color: ${props=>{
    switch (props.variant){
      case "primary": return "#457B9D";
      default : return "#F1FAEE";
    }
  }};
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-left: 1px solid #F1FAEE;
  padding: 3px 5px;
  width: 50%;
  &:hover{
    filter: brightness(1.2);
  }
  :disabled{
    filter: brightness(0.5);
    cursor: auto;
    :hover{
      filter: brightness(0.5);
    }
  }
`;