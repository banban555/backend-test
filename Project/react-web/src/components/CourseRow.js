import React, { useMemo } from "react";
import { useDrag } from "react-dnd";
import classNames from "classnames";
import styles from "../css/Application.module.css";

const CourseRow = (props) => {
  const { record, onClick, selectedRowId } = props;

  const dragItem = useMemo(
    () => ({
      type: "COURSE",
      item: { course: record },
    }),
    [record]
  );

  const [{ isDragging }, dragRef] = useDrag(dragItem);
  const rowClasses = classNames({
    dragging: isDragging,
    [styles.selectedRow]:
      record && record._id ? record._id === selectedRowId : false,
  });
  return (
    <tr ref={dragRef} className={rowClasses} onClick={() => onClick(record)}>
      {props.children}
    </tr>
  );
};

export default CourseRow;
