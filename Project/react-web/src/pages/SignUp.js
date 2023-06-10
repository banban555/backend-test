import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import Form from "../components/common/Form";
import { Input, PasswordInput } from "../components/common/Input";
import SelectInput from "../components/signup/Select";
import Button from "../components/common/Button";
import TextComponent from "../components/common/TextComponent";
import StyledModal from "../components/common/Modal";

function SignUp() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    studentNum: "",
    email: "",
    password: "",
    major: "",
    grade: "",
  });

  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModalVisible(true);
    axios
      .post("/signup", userInfo)
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const navigate = useNavigate();

  const handleOk = () => {
    setModalVisible(false);
    navigate("/signin");
  };

  return (
    <SignUpContainer>
      <Logo src="/loginLogo.png" alt="loginLogo" />
      <Form onSubmit={handleSubmit}>
        <Input
          name="name"
          placeholder="성명"
          onChange={handleChange}
          required
        />
        <Input
          name="studentNum"
          placeholder="학번"
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          onChange={handleChange}
          required
        />
        <PasswordInput
          name="password"
          type="password"
          placeholder="비밀번호"
          onChange={handleChange}
          required
        />
        <SelectInput
          name="major"
          handleChange={handleChange}
          options={[
            { value: "null", label: "전공" },
            { value: "건설환경공학과", label: "건설환경공학과" },
            { value: "교육학과", label: "교육학과" },
            { value: "통계학과", label: "통계학과" },
            { value: "융합소프트웨어", label: "융합소프트웨어" },
            { value: "데이터사이언스", label: "데이터사이언스" },
          ]}
        />
        <SelectInput
          name="grade"
          handleChange={handleChange}
          options={[
            { value: "null", label: "학년" },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
        />
        <Button type="submit">회원가입</Button>
      </Form>
      <TextComponent
        text="이미 계정이 있으신가요?"
        linkText="로그인"
        linkTo="/signin"
      />
      <StyledModal
        isOpen={modalVisible}
        handleClose={handleCloseModal}
        message="회원가입이 완료되었습니다."
        handleOk={handleOk}
      />
    </SignUpContainer>
  );
}

const SignUpContainer = styled.div`
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default SignUp;
