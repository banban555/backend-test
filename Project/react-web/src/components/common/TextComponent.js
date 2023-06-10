import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import theme from "../../styles/theme";

const TextContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledText = styled.p`
  font: ${theme.fonts.caption3};
  color: ${theme.colors.gray800};
`;

const StyledLink = styled(Link)`
  color: ${theme.colors.LightOrange};
  font: ${theme.fonts.caption2};
  text-decoration: none;
  font-size: 1.2rem;
  margin: 10px 10px;
  &:hover {
    text-decoration: none;
    color: ${theme.colors.semiDarkOrange};
  }
`;

const TextComponent = ({ text, linkText, linkTo }) => {
  return (
    <TextContainer>
      <StyledText>{text}</StyledText>
      <StyledLink to={linkTo}>{linkText}</StyledLink>
    </TextContainer>
  );
};

export default TextComponent;
