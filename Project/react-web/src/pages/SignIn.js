import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styled from "styled-components";

import Input from "../components/common/Input";
import CustomModal from "../components/common/Modal";
import Button from "../components/common/Button";
import TextComponent from "../components/common/TextComponent";
import PasswordInput from "../components/common/Input";

const SignIn = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
          setModalVisible(true);
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

  const handleCloseModal = () => {
    setModalVisible(false);
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

      <CustomModal
        isOpen={modalVisible}
        handleClose={handleCloseModal}
        errorMessage="아이디와 비밀번호를 확인해주세요"
      />
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

const StyledImage = styled.img`
  width: 32rem;
  max-width: 250px;
  display: block;
  margin-bottom: 1rem;
  float: left;
`;

export default SignIn;
