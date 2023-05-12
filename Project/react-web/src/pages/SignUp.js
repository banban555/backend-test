import React from "react";
import { Form, Input, Select, Checkbox, Button, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";
import "../css/SignUp.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const { Option } = Select;
const { Title } = Typography;


function SignUp()
{
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("함수 실행");
    console.log(values);
    const userInfo = {
      name: values.name,
      studentNum: values.studentNum,
      email: values.email,
      password: values.password,
    };
    console.log(userInfo);

    axios
      .post("/signup", userInfo)
      .then((res) => {
        console.log(res.data);
        navigate("/signin"); // 회원가입 완료 후 이동할 페이지
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="signup-container">
      <Title level={2}>Sign Up</Title>
      <Form
        name="signup"
        className="signup-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Please input your First Name!",
                },
              ]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Please input your Last Name!",
                },
              ]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: "Please confirm your Password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item
          name="gender"
          rules={[
            {
              required: true,
              message: "Please select your Gender!",
            },
          ]}
        >
          <Select placeholder="Select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>I agree with terms and conditions.</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="signup-form-button">
            Sign Up
          </Button>
        </Form.Item>
        <Form.Item>
          Already have an account? <Link to="/signin">Sign In</Link>
        </Form.Item>
      </Form>
    </div>
  );
};



export default SignUp;