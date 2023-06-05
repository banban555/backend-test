import { React, useEffect, useState } from "react";
import { Layout, Button } from "antd";

import styles from "../css/MyPage.module.css";
import axios from "axios";
import { useCookies } from "react-cookie";
import ModifyUserInfo from "../components/ModifyUserInfo.js";

const { Header } = Layout;

const MyPage = () => {
  const [cookies, setcookie, removecookie] = useCookies(["x_auth"]);

  const [userInfo, setUserInfo] = useState(null);

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
  }, []); // []은 의존성 배열입니다. 이 배열이 비어있으면 컴포넌트가 처음 마운트될 때 한 번만 실행됩니다.

  const logoutURL = "/signin"; // 리다이렉트할 URL 을 상수화시켜서 넣어주었다.

  //로그아웃
  const handleLogout = () => {
    // 로그아웃 버튼을 누르면 실행되는 함수
    removecookie("x_auth"); // 쿠키삭제후
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
