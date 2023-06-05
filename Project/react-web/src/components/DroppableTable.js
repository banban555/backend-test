import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Table } from "antd";
import StyledModal from "../components/common/Modal";
import axios from "axios";
import { useCookies } from "react-cookie";

const DroppableTable = ({
  dataSource,
  columns,
  setAddedData,
  onRowClick,
  refreshSelectedCourses,
  setCount,
}) => {
  const [cookies] = useCookies(["x_auth"]);
  const token = cookies.x_auth;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [, dropRef] = useDrop(() => ({
    accept: "COURSE",
    drop: (item, monitor) => {
      setAddedData((prevData) => {
        if (!prevData.some((data) => data._id === item.course._id)) {
          const data = {
            userToken: token,
            lectureId: item.course._id,
          };
          axios
            .post("/application/add", data)
            .then((res) => {
              refreshSelectedCourses(); // 강의 추가 후 강의 목록을 다시 불러옴
              setCount(res.data.count);
            })
            .catch((err) => {
              console.error(err);
            });
          return [...prevData, item.course]; // item.course를 추가합니다.
        } else {
          setIsModalVisible(true); // 만약 이미 수강신청된 강의라면 모달을 띄웁니다.
        }
        return prevData; // 그렇지 않다면, prevData를 그대로 반환합니다.
      });
    },
  }));

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Table
        ref={dropRef}
        dataSource={dataSource}
        columns={columns}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
      <StyledModal
        title="경고"
        isOpen={isModalVisible}
        onCancel={handleCancel}
        handleOk={handleOk}
        message="이미 수강 신청된 강의입니다"
      />
    </>
  );
};

export default DroppableTable;
