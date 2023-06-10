import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styled from "styled-components";

import { Input, PasswordInput } from "../components/common/Input";
import Form from "../components/common/Form";
import Logo from "../components/common/Logo";
import StyledModal from "../components/common/Modal";
import Button from "../components/common/Button";
import TextComponent from "../components/common/TextComponent";

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
        if (res.data.loginSuccess === false) {
          setModalVisible(true);
        }
        if (res.data.loginSuccess === true) {
          navigate("/application");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOk = () => {
    setModalVisible(false);
    navigate("/signin");
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <SignInContainer>
      <Logo src="/loginLogo.png" alt="loginLogo" />

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

      <StyledModal
        isOpen={modalVisible}
        handleClose={handleCloseModal}
        message="아이디와 비밀번호를 확인해주세요"
        handleOk={handleOk}
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

export default SignIn;
