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

const StyeldTimeTable = styled(AntTable)`
  .has-data {
    background-color: ${theme.colors.LightOrange};
    font: ${theme.fonts.body4};
    color: white;
  }
  .ant-table-cell {
    text-align: center;
  }
  .ant-table-row:hover .has-data,
  .has-data:hover {
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
  const [isOverCountModalVisible, setIsOverCountModalVisible] = useState(false); // 초과 학점 모달 visible 상태

  const courseSelectionReducer = (state, action) => {
    switch (action.type) {
      case "toggle":
        const newState = { ...state };
        newState[action.courseId] = !newState[action.courseId];
        return newState;
      case "reset":
        return {};
      default:
        throw new Error();
    }
  };
  const [selectedCourses, dispatch] = useReducer(courseSelectionReducer, {});

  const [, drop] = useDrop(() => ({
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
    dispatch({ type: "reset" });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    dispatch({ type: "reset" });
  };

  const handleCancelcheck = () => {
    setIsCheckModalVisible(false);
    dispatch({ type: "reset" });
  };

  const handleOkcheck = () => {
    setIsCheckModalVisible(false);
    dispatch({ type: "reset" });
  };

  const handleOverCountModalOk = () => {
    setIsOverCountModalVisible(false);
    dispatch({ type: "reset" });
  };

  const handleOverCountModalCancel = () => {
    setIsOverCountModalVisible(false);
    dispatch({ type: "reset" });
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
          .map((course, index, arr) => (
            <>
              <div
                key={course._id}
                className={`${selectedCourses[course._id] ? "selected" : ""} ${
                  index < arr.length - 1 ? "border-bottom" : ""
                }`}
                onClick={(event) => {
                  event.stopPropagation();
                  onRowClick(course);
                  dispatch({ type: "toggle", courseId: course._id });
                }}
              >
                <p>{course.professor}</p>
                <p>{course.name}</p>
              </div>
              {index < arr.length - 1 && <hr />}
            </>
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
        <StyeldTimeTable
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
      <StyledModal
        isOpen={isOverCountModalVisible}
        handleClose={handleOverCountModalCancel}
        message="수강신청 가능한 학점을 초과하였습니다."
        handleOk={handleOverCountModalOk}
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
