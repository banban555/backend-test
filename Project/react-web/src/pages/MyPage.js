import { React, useEffect, useState } from "react";
import {
  Layout,
  Select,
  Button,
  Form,
  Input,
  Row,
  Col,
  Table,
  Tabs,
  Modal,
} from "antd";
import My_Page from "../components/ModifyUserInfo.js";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DroppableTable from "../components/DroppableTable.js";
import CourseRow from "../components/CourseRow.js";
import styles from "../css/MyPage.module.css";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import StyledTimeTable from "../components/TimeTable.js";
import { useCookies } from "react-cookie";
import ModifyUserInfo from "../components/ModifyUserInfo.js";

const { Option } = Select;
const { TabPane } = Tabs;
const { Header, Content } = Layout;

const MyPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectMajor, setSelectMajor] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [addedData, setAddedData] = useState([]);

  const [cookies, setcookie, removecookie] = useCookies(["x_auth"]);
  const token = cookies.x_auth;

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    axios
      .get("/application/userInfo")
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setUserInfo(response.data.data);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []); // []은 의존성 배열입니다. 이 배열이 비어있으면 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.

  const COOKIE_KEY = window.LOGIN_KEY; // 상수화시킨 쿠키 값을 넣어줬다.

  const logoutURL = "/signin"; // 리다이렉트할 URL 을 상수화시켜서 넣어주었다.

  const [, , removeCookie] = useCookies([COOKIE_KEY]); // 쓰지 않는 변수는 (공백),처리해주고 removeCookie 옵션만 사용한다

  //로그아웃
  const handleLogout = () => {
    // 로그아웃 버튼을 누르면 실행되는 함수
    removeCookie(COOKIE_KEY, { path: "/signin" }); // 쿠키삭제후
    window.location.href = logoutURL; // 현재url을 변경해준다.
  };

  return (
    <Layout>
      <Header className={styles.header}>
        <img src="logo.png" alt="logo" className={styles.logo} />

        <div className={styles.headerRight}>
          <div className={styles.headerRightTopRight}>
            <span className={styles.headerRightTopRightText}>
              {userInfo && userInfo.name}님
            </span>
            <span className={styles.headerRightTopRightText}>
              {userInfo && userInfo.major}
            </span>
          </div>
          <div className={styles.headerRightTopRight}>
            <Button
              type="primary"
              className={styles.headerRightTopRightButton}
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </div>
        </div>
        <div className={styles.headerRightBottom}>
          <Button
            type="primary"
            className={styles.headerRightTopRightButton}
            onClick={() => {
              window.location.href = "/application";
            }}
          >
            희망강의신청
          </Button>
        </div>
      </Header>
      <ModifyUserInfo />
    </Layout>
  );
};

export default MyPage;
