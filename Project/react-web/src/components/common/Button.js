// components/Button.js
import styled from "styled-components";
import theme from "../../styles/theme";

const Button = styled.button`
  background-color: ${theme.colors.LightOrange};
  color: white;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font: ${theme.fonts.body4};
  &:hover,
  &:focus {
    background-color: ${theme.colors.semiDarkOrange};
  }
`;

export default Button;
