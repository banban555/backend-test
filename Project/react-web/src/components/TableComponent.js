import { useState } from "react";
import { Table } from "antd";
import CourseRow from "./CourseRow.js";

const TableComponent = ({ dataSource, columns }) => {
  const [selectedRowId, setSelectedRowId] = useState(null);

  const handleDataClick = (record) => {
    setSelectedRowId(record._id);
  };

  return (
    <Table
      components={{
        body: { row: CourseRow },
      }}
      dataSource={dataSource}
      columns={columns}
      onRow={(record) => ({
        record,
        selectedRowId,
        onClick: () => handleDataClick(record),
      })}
    />
  );
};

export default TableComponent;
