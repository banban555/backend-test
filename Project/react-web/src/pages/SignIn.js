import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../styles/theme";
import Button from "../components/common/Button";
import TextComponent from "../components/common/TextComponent";

const SignIn = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userInfo = {
      studentNum: data.get("studentNum"),
      password: data.get("password"),
    };
    axios
      .post("/signin", userInfo)
      .then((res) => {
        console.log(res.data);
        if (res.data.loginSuccess === false) {
          setErrorModalVisible(true);
          setErrorMessage(res.data.message);
        }
        if (res.data.loginSuccess === true) {
          console.log("로그인 성공");
          navigate("/application");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCloseErrorModal = () => {
    setErrorModalVisible(false);
    setErrorMessage("");
  };

  return (
    <SignInContainer>
      <StyledImage src="/loginLogo.png" alt="loginLogo" />

      <Form onSubmit={handleSubmit}>
        <Input required placeholder="학번" name="studentNum" />
        <PasswordInput required placeholder="비밀번호" name="password" />
        <Button type="submit">LOGIN</Button>
        <TextComponent
          text="아직 계정이 없으신가요?"
          linkText="회원가입"
          linkTo="/signup"
        />
      </Form>

      <ModalContainer open={errorModalVisible}>
        <ModalContent>
          <CloseButton onClick={handleCloseErrorModal}>&times;</CloseButton>
          <p>{errorMessage}</p>
        </ModalContent>
      </ModalContainer>
    </SignInContainer>
  );
};

const SignInContainer = styled.div`
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Form = styled.form`
  max-width: 32rem;
  max-height: 100rem;
  margin: 0 auto;
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 100%;
  height: 3.2rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 4px;
  font-size: 1rem;
`;

const PasswordInput = styled(Input).attrs({ type: "password" })``;

const ModalContainer = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
`;

const CloseButton = styled.span`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`;

const StyledImage = styled.img`
  width: 32rem;
  max-width: 250px;
  display: block;
  margin-bottom: 1rem;
  float: left;
`;

export default SignIn;
