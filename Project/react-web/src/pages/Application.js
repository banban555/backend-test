import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme, Select, Tabs } from "antd";
import React from "react";
const { Header, Content, Sider } = Layout;

const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const onChange = (key) => {
  console.log(key);
};

const Application = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Header
        className="header"
        style={{
          height: "100px",
          background: "#D54728",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <img src="logo.png" alt="logo" />
        <div className="logo" />
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
              background: "#D54728",
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <h1 style={{ color: "#D54728" }}>희망강의신청</h1>
            <div style={{ background: "#FAFAFA" }}>
              <div id="search">
                <span>학번/성명</span>
                <input type="text" />
                <input type="text" />
                <div>
                  <span>소속</span>
                  <input type="text" />
                  <span>학년/가진급학년</span>
                  <input type="text" />
                  <span>강의년도</span>
                  <input type="text" />
                  <span>강의학기</span>
                  <input type="text" />
                </div>
                <div>
                  <span>교과목</span>
                  <Select
                    defaultValue="교과목명"
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                      { value: "교과목명", label: "교과목명" },
                      { value: "학수번호", label: "학수번호" },
                    ]}
                  />
                  <input type="text" />
                  <span>교원명</span>
                  <input type="text" />
                  <span>희망강의 신청가능학점</span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0px",
              }}
            >
              <span
                style={{
                  width: "48%",
                  height: "500px",
                  background: "#FAFAFA",
                }}
              >
                종합강의시간표목록
                <table style={{ width: "100%", border: "1px solid" }}>
                  <tr>
                    <th>교과목명</th>
                    <th>교원명</th>
                    <th>요일/시간</th>
                    <th>강의실</th>
                    <th>학수강좌번호</th>
                    <th>수강정원</th>
                    <th>신청인원</th>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </span>
              <Tabs
                style={{
                  width: "48%",
                  height: "500px",
                  background: "#FAFAFA",
                }}
                onChange={onChange}
                type="card"
                const
                items={new Array(2).fill(null).map((_, i) => {
                  const id = String(i + 1);
                  const views = ["테이블뷰", "시간표뷰"];
                  return {
                    label: views[i],
                    key: id,
                    children: `희망강의 수강신청 확인 뷰 ${id}`,
                  };
                })}
              />
              {/* <span
                style={{
                  width: "48%",
                  height: "300px",
                  background: "#FAFAFA",
                }}
              >
                테이블뷰/시간표뷰
              </span> */}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Application;
