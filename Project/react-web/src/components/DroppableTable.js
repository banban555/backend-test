import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { Table } from "antd";
import StyledModal from "../components/common/Modal";
import axios from "axios";
import { useCookies } from "react-cookie";
import styles from "../css/Application.module.css";
import classNames from "classnames";
import styled from "styled-components";

const StyledDropTable = styled(Table)`
  .ant-table-row:hover,
  .ant-table-row:hover > td {
    background-color: #e79e2f !important;
    color: white !important;
  }
`;

const DroppableTable = ({
  dataSource,
  columns,
  setAddedData,
  onRowClick,
  refreshSelectedCourses,
  setCount,
  selectedRow,
  setSelectedRow,
}) => {
  const [cookies] = useCookies(["x_auth"]);
  const token = cookies.x_auth;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOverCountModalVisible, setIsOverCountModalVisible] = useState(false); // 초과 학점 모달 visible 상태
  const [isCheckModalVisible, setIsCheckModalVisible] = useState(false);

  const [, dropRef] = useDrop(() => ({
    accept: "COURSE",
    drop: async (item, monitor) => {
      const data = {
        userToken: token,
        lectureId: item.course._id,
      };

      try {
        const res = await axios.post("/application/add", data);

        if (res.status === 200) {
          setIsCheckModalVisible(true);
          refreshSelectedCourses();
          setCount(res.data.count);
          setAddedData((prevData) => [...prevData, item.course]);
        }
      } catch (err) {
        if (err.response.status === 401) {
          setIsModalVisible(true);
        }
        if (err.response.status === 402) {
          setIsOverCountModalVisible(true);
          setCount(err.response.data.count);
        }
      }
    },
  }));

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedRow({
      tableId: null,
      rowId: null,
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedRow({
      tableId: null,
      rowId: null,
    });
  };

  const handleCancelcheck = () => {
    setIsCheckModalVisible(false);
    setSelectedRow({
      tableId: null,
      rowId: null,
    });
  };

  const handleOkcheck = () => {
    setIsCheckModalVisible(false);
    setSelectedRow({
      tableId: null,
      rowId: null,
    });
  };

  const handleOverCountModalOk = () => {
    setIsOverCountModalVisible(false);
    setSelectedRow({
      tableId: null,
      rowId: null,
    });
  };

  const handleOverCountModalCancel = () => {
    setIsOverCountModalVisible(false);
    setSelectedRow({
      tableId: null,
      rowId: null,
    });
  };

  return (
    <>
      <StyledDropTable
        ref={dropRef}
        dataSource={dataSource}
        columns={columns}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          className: classNames({
            [styles.selectedRow]:
              record && record._id && selectedRow.tableId === "table2"
                ? record._id === selectedRow.rowId
                : false,
          }),
        })}
      />
      <StyledModal
        title="경고"
        isOpen={isModalVisible}
        onCancel={handleCancel}
        handleOk={handleOk}
        message="이미 수강 신청된 강의입니다"
      />
      <StyledModal
        title="확인"
        isOpen={isCheckModalVisible}
        onCancel={handleCancelcheck}
        handleOk={handleOkcheck}
        message={"수강신청이 완료되었습니다"}
        // message={`${dataSource.name} ${dataSource.count} 수강신청이 완료되었습니다`}
      />
      <StyledModal
        isOpen={isOverCountModalVisible}
        handleClose={handleOverCountModalCancel}
        message="수강신청 가능한 학점을 초과하였습니다."
        handleOk={handleOverCountModalOk}
      />
    </>
  );
};

export default DroppableTable;
