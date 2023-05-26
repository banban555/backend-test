import styled from "styled-components";
import theme from "../../styles/theme";

const SelectWrapper = styled.select`
  ${theme.fonts.caption3}
  color: ${theme.colors.gray700};
  margin-bottom: 1rem;
  width: 100%;
  height: 3.2rem;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 4px;
  padding: 0.5rem;
`;

const OptionWrapper = styled.option`
  // color: ${theme.colors.gray700};
  // font: ${theme.fonts.caption1};
`;

const SelectInput = ({ name, placeholder, options, handleChange }) => {
  return (
    <SelectWrapper name={name} onChange={handleChange} required>
      {options.map((option, index) => (
        <OptionWrapper key={index} value={option.value}>
          {option.label}
        </OptionWrapper>
      ))}
    </SelectWrapper>
  );
};

export default SelectInput;
