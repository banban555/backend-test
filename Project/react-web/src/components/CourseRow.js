import React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import classNames from "classnames";
import { useEffect, useRef } from "react";

const CourseRow = (props) => {
  const { record, onClick } = props;
  const recordRef = useRef(record); // record를 참조하는 ref를 만듭니다.
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "COURSE",
    item: { course: recordRef.current }, // 이제 여기서 current를 사용하여 항상 최신의 record를 참조합니다.
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // useEffect(() => {
  //   recordRef.current = record; // record가 변경될 때마다 recordRef를 업데이트합니다.
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, [record, preview]);

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
