import React, { useMemo } from "react";
import { useDrag } from "react-dnd";
import classNames from "classnames";
import styles from "../css/Application.module.css";

const CourseRow = (props) => {
  const { record, onClick, selectedRow } = props;

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
      record && record._id && selectedRow.tableId === "table1"
        ? record._id === selectedRow.rowId
        : false,
  });
  return (
    <tr ref={dragRef} className={rowClasses} onClick={() => onClick(record)}>
      {props.children}
    </tr>
  );
};

export default CourseRow;
