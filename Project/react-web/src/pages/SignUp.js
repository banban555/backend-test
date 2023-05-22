import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Checkbox,
  Button,
  Typography,
  Row,
  Col,
  Modal,
} from "antd";
import { Link } from "react-router-dom";
import "../css/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

function SignUp() {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 창의 상태를 관리하는 state

  const onFinish = (values) => {
    const userInfo = {
      name: values.name,
      studentNum: values.studentNum,
      email: values.email,
      password: values.password,
      grade: values.grade,
      major: values.major,
    };

    axios
      .post("/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        setIsModalVisible(true); // 회원가입 완료 후 모달 창을 보여줍니다.
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleOk = () => {
    setIsModalVisible(false); // 확인 버튼을 누르면 모달 창을 닫습니다.
    navigate("/signin"); // 모달 창이 닫힌 후 로그인 페이지로 이동합니다.
  };

  return (
    <div className="signup-container">
      <img src="/loginLogo.png" alt="loginLogo" className="loginLogo" />
      <Form
        name="signup"
        className="signup-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "성명을 입력해주세요",
            },
          ]}
        >
          <Input placeholder="성명" />
        </Form.Item>

        <Form.Item
          name="studentNum"
          rules={[
            {
              required: true,
              message: "학번을 입력해주세요.",
            },
          ]}
        >
          <Input placeholder="학번" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input placeholder="이메일" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "비밀번호를 입력해주세요",
            },
          ]}
        >
          <Input.Password placeholder="비밀번호" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "비밀번호를 다시 확인해주세요",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("비밀번호가 일치하지 않습니다.")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="비밀번호 확인" />
        </Form.Item>

        <Form.Item
          name="major"
          rules={[
            {
              required: true,
              message: "전공을 선택해주세요",
            },
          ]}
        >
          <Select placeholder="전공">
            <Option value="consturction">건설공학과</Option>
            <Option value="education">교육학과</Option>
            <Option value="statistic">통계학과</Option>
            <Option value="software">융합소프트웨어</Option>
            <Option value="data">데이터사이언스</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="grade"
          rules={[
            {
              required: true,
              message: "학년을 선택해주세요!",
            },
          ]}
        >
          <Select placeholder="학년">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="signup-form-button"
          >
            회원가입
          </Button>
        </Form.Item>

        <Form.Item className="signin-container">
          <div className="signin-text-container">
            <p className="signin-text"> 이미 계정이 있으신가요? </p>
            <Link to="/signin" className="signin-link">
              로그인
            </Link>
          </div>
        </Form.Item>
      </Form>

      <Modal
        title="회원가입 완료"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
      >
        <p>회원가입이 완료되었습니다!</p>
      </Modal>
    </div>
  );
}

export default SignUp;
