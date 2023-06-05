import React, { useState } from "react";
import { Table as AntTable } from "antd";
import styled from "styled-components";
import theme from "../styles/theme";
import StyledModal from "../components/common/Modal";
import { useDrop } from "react-dnd";
import { useCookies } from "react-cookie";
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
  onRowClick,
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

        // 각 셀에 들어갈 내용
        const content = transformedData[day]
          .filter(
            (course) =>
              course.startTime <= record.time && course.endTime > record.time
          )
          .map((course) => (
            <div
              key={course._id}
              onClick={(event) => {
                event.stopPropagation(); // 이벤트 버블링 막기
                onRowClick(course); // 클릭한 강의 선택
              }}
            >
              {course.name}
            </div>
          ));

        return {
          children: content,
          props: customProps,
        };
      },
    })),
  ];

  // 변경 후
  const data = timeSlots.map((timeSlot, index) => {
    const row = { key: index, time: timeSlot.time };
    days.forEach((day) => {
      const courses = transformedData[day].filter(
        (course) =>
          course.startTime <= timeSlot.time && course.endTime > timeSlot.time
      );
      row[day] = courses.length > 0 ? courses[0] : null; // course 객체를 직접 저장
    });
    return row;
  });

  return (
    <>
      <div ref={drop}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          onRow={(record) => ({
            onClick: (event) => {
              const day = event.target.getAttribute("data-column-key");
              if (day && record[day]) {
                onRowClick(record[day]);
              }
            },
          })}
        />
      </div>
      <StyledModal
        title="경고"
        open={isModalVisible}
        onCancel={handleCancel}
        handleOk={handleOk}
        message="이미 수강 신청된 강의입니다"
      />
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
          _id: course["_id"],
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
