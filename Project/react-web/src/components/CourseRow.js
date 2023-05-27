import React, { useMemo } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import classNames from "classnames";
import { useEffect, useRef } from "react";

const CourseRow = (props) => {
  const { record, onClick } = props;

  const dragItem = useMemo(
    () => ({
      type: "COURSE",
      item: { course: record },
    }),
    [record]
  ); // `record`가 변경될 때마다 dragItem을 재생성합니다.

  const [{ isDragging }, dragRef] = useDrag(dragItem);

  const rowClasses = classNames({
    dragging: isDragging,
  });

  return (
    <tr ref={dragRef} className={rowClasses} onClick={() => onClick(record)}>
      {props.children}
    </tr>
  );
};

export default CourseRow;
