import React from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';  // CSS 클래스를 조건적으로 적용할 수 있는 라이브러리입니다.

const CourseRow = (props) => {
  const { record, onClick } = props;

  const [{isDragging}, dragRef] = useDrag(() => ({
      type: 'COURSE',
      item: { course: record },
      collect: (monitor) => ({
      isDragging: monitor.isDragging()
      }),
  }));

  const rowClasses = classNames({
    'dragging': isDragging,
  });

  return (
    <tr ref={dragRef} className={rowClasses} onClick={() => onClick(record)}> 
      {props.children}
    </tr>
  );
};

export default CourseRow;