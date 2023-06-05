import { React, useEffect, useState } from "react";
import styled from "styled-components";
import { Input, PasswordInput } from "../components/common/Input";
import SelectInput from "../components/signup/Select";
import axios from "axios";

const ModifyContainer = styled.div`
  margin: 10vh auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 50vw;
`;

const ModifyTitle = styled.h2`
  padding: 10px 20px;
  font-size: 1vw;
  font-weight: 600;
`;

const ModifyForm = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ModifyButton = styled.button`
  padding: 5px 10px;
  background-color: #d54728;
  color: white;
  cursor: pointer;
`;

const ModifyUserInfo = () => {
  useEffect(() => {
    axios
      .get("/application/userInfo")
      .then((response) => {
        if (response.data.success) {
          setUserInfo(response.data.data);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const [userInfo, setUserInfo] = useState({
    name: "",
    studentNum: "",
    email: "",
    password: "",
    major: "",
    grade: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 서버로 회원정보 수정 요청 보내기
    const data = {
      name: userInfo.name,
      studentNum: userInfo.studentNum,
      email: userInfo.email,
      password: userInfo.password,
      major: userInfo.major,
      grade: userInfo.grade,
    };
    axios
      .put("/mypage/userInfo", userInfo)
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <ModifyContainer>
      <ModifyTitle>회원정보</ModifyTitle>
      <ModifyForm onSubmit={handleSubmit}>
        <Input
          name="name"
          placeholder={userInfo.name}
          onChange={handleChange}
          required
        />
        <Input
          name="studentNum"
          placeholder={userInfo.studentNum}
          onChange={handleChange}
          required
        />
        <Input
          name="email"
          type="email"
          placeholder={userInfo.email}
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
            { value: "null", label: userInfo.major },
            { value: "consturction", label: "건설공학과" },
            { value: "education", label: "교육학과" },
            { value: "statistic", label: "통계학과" },
            { value: "software", label: "융합소프트웨어" },
            { value: "data", label: "데이터사이언스" },
          ]}
        />
        <SelectInput
          name="grade"
          handleChange={handleChange}
          options={[
            { value: "null", label: userInfo.grade },
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
        />

        <ModifyButton type="submit" onClick={handleSubmit}>
          수정
        </ModifyButton>
      </ModifyForm>
    </ModifyContainer>
  );
};

export default ModifyUserInfo;
