import React, { useState, useReducer } from "react";
import { Table as AntTable } from "antd";
import styled from "styled-components";
import theme from "../styles/theme";
import StyledModal from "../components/common/Modal";
import { useDrop } from "react-dnd";
import { useCookies } from "react-cookie";
import axios from "axios";
import "../css/TimeTable.css";

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
  setCount,
}) => {
  const transformedData = transformDataToEvents(dataSource);
  const [cookies] = useCookies(["x_auth"]);
  const token = cookies.x_auth;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheckModalVisible, setIsCheckModalVisible] = useState(false);
  // const [isSelected, setIsSelected] = useState(false); // 강의 선택 상태를 관리하는 상태 변수

  const courseSelectionReducer = (state, action) => {
    switch (action.type) {
      case "toggle":
        const newState = { ...state };
        newState[action.courseId] = !newState[action.courseId];
        return newState;
      case "reset":
        return {}; // 모든 선택 상태를 초기화합니다.
      default:
        throw new Error();
    }
  };
  const [selectedCourses, dispatch] = useReducer(courseSelectionReducer, {});

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
              if (res.data.count !== 0) {
                setIsCheckModalVisible(true);
              } // count가 0이 아니라면 수강신청 완료 모달을 띄웁니다.
              refreshSelectedCourses(); // 강의 추가 후 강의 목록을 다시 불러옴
              setCount(res.data.count);
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
    dispatch({ type: "reset" });
    // setIsSelected(!isSelected);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    dispatch({ type: "reset" });
    // setIsSelected(!isSelected);
  };

  const handleCancelcheck = () => {
    setIsCheckModalVisible(false);
    dispatch({ type: "reset" });
    // setIsSelected(!isSelected);
  };

  const handleOkcheck = () => {
    setIsCheckModalVisible(false);
    dispatch({ type: "reset" });
    // setIsSelected(!isSelected);
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
              className={selectedCourses[course._id] ? "selected" : ""}
              // className={isSelected ? "selected" : ""} // isSelected 상태에 따라 CSS 클래스를 바꿉니다.
              onClick={(event) => {
                event.stopPropagation();
                onRowClick(course);
                console.log("클릭된 강의:", course);
                // 선택 상태를 토글하기 위해 'toggle' 액션을 dispatch합니다.
                dispatch({ type: "toggle", courseId: course._id });
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
              console.log("클릭된 강의:", record[day]);
              if (day && record[day]) {
                onRowClick(record[day]);
              }
            },
          })}
        />
      </div>
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
        message={`${data.name} ${data.count} 수강신청이 완료되었습니다`}
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
