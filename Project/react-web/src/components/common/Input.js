// components/Input.js
import styled from "styled-components";
import theme from "../../styles/theme";

export const Input = styled.input`
  width: 100%;
  height: 3.2rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

export const PasswordInput = styled(Input).attrs({ type: "password" })``;
