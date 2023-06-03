import React, { useState } from "react";
import { Table as AntTable } from "antd";
import styled from "styled-components";
import theme from "../styles/theme";
import { useDrop } from "react-dnd";
import { useCookies } from "react-cookie";
import { Modal } from "antd";
import axios from "axios";

const days = ["월", "화", "수", "목", "금"];
const timeSlots = [];
for (let i = 9; i < 22; i++) {
  timeSlots.push({
    time: `${i.toString().padStart(2, "0")}:00 - ${i
      .toString()
      .padStart(2, "0")}:30`,
  });
  timeSlots.push({
    time: `${i.toString().padStart(2, "0")}:30 - ${(i + 1)
      .toString()
      .padStart(2, "0")}:00`,
  });
}

const Table = styled(AntTable)`
  .has-data {
    background-color: ${theme.colors.LightOrange};
    font: ${theme.fonts.body4};
    color: white;
  }
  .ant-table-cell {
    text-align: center;
  }
  .ant-table-row:hover .has-data,
  .has-data:hover,
  .ant-table-cell.ant-table-row-hover {
    background: ${theme.colors.LightOrange} !important;
  }
`;

const StyledTimeTable = ({
  dataSource,
  setAddedData,
  refreshSelectedCourses,
}) => {
  const transformedData = transformDataToEvents(dataSource);
  const [cookies] = useCookies(["x_auth"]);
  const token = cookies.x_auth;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [, drop] = useDrop(() => ({
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
            })
            .catch((err) => {
              console.error(err);
            });
          return [...prevData, item.course];
        } else {
          setIsModalVisible(true);
        }
        return prevData;
      });
    },
  }));

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "",
      dataIndex: "time",
      key: "time",
      width: "10%",
    },
    ...days.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      align: "center",
      width: "18%",
      render: (text, record, index) => {
        const customProps = {};

        if (text) {
          customProps.className = "has-data";
        }

        return {
          children: <div>{text}</div>,
          props: customProps,
        };
      },
    })),
  ];

  const data = timeSlots.map((timeSlot, index) => {
    const row = { key: index, time: timeSlot.time };
    days.forEach((day) => {
      const courses = transformedData[day]
        .filter(
          (course) =>
            course.startTime <= timeSlot.time && course.endTime > timeSlot.time
        )
        .map((course) => course.name)
        .join(", ");
      row[day] = courses ? courses : "";
    });
    return row;
  });

  return (
    <>
      <div ref={drop}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
      <Modal
        title="경고"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        이미 수강 신청된 강의입니다
      </Modal>
    </>
  );
};

export default StyledTimeTable;

function transformDataToEvents(data) {
  const events = {
    월: [],
    화: [],
    수: [],
    목: [],
    금: [],
  };

  const daysOfWeek = ["월", "화", "수", "목", "금"];

  for (let course of data) {
    const days = course["요일"].split(",");
    const times = course["시간"].split(",");

    for (let i = 0; i < days.length; i++) {
      const [start, end] = times[i].split("-").map((time) => {
        const hours = Math.floor(time) + 8; // add 8 to start from 9:00
        const minutes = (time % 1) * 60; // convert decimal to minutes
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      });

      const day = days[i];
      if (events.hasOwnProperty(day)) {
        events[day].push({
          id: course["_id"],
          name: course["교과목명"],
          professor: course["교원명"],
          startTime: start,
          endTime: end,
        });
      }
    }
  }

  const timetable = {};
  for (const day of daysOfWeek) {
    timetable[day] = events[day];
  }
  return timetable;
}
