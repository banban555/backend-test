import React from "react";
import { Table } from "antd";

const days = ["월", "화", "수", "목", "금"];
const timeSlots = [];
for (let i = 9; i < 22; i++) {
  timeSlots.push({
    time: `${i.toString().padStart(2, "0")}:00 - ${(i + 1)
      .toString()
      .padStart(2, "0")}:00`,
  });
}
timeSlots.push({ time: "22:00 - 22:30" }); // last half-hour

const StyledTimeTable = ({ dataSource }) => {
  const transformedData = transformDataToEvents(dataSource);

  const columns = [
    {
      title: "",
      dataIndex: "time",
      key: "time",
      render: (text, record, index) => {
        const rowSpan = timeSlots[index].rowSpan;
        return {
          children: text,
          props: {
            rowSpan: rowSpan,
          },
        };
      },
    },
    ...days.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
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
        .map((course) => course.name);

      row[day] = courses.length > 0 ? courses.join(", ") : "";
    });
    return row;
  });

  // Merge cells vertically
  let previousData = null;
  let rowSpan = 0;
  for (let i = 0; i < data.length; i++) {
    const currentData = data[i];
    if (currentData.time === previousData?.time) {
      rowSpan++;
      previousData.time = null;
    } else {
      previousData = currentData;
      previousData.rowSpan = rowSpan + 1; // Add 1 for the merged cell
      rowSpan = 0;
    }
  }

  return <Table columns={columns} dataSource={data} pagination={false} />;
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
