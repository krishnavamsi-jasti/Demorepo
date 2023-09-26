import React from "react";
import "./AdvancedSearchGrid.scss";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Selection,
} from "devextreme-react/data-grid";

function AdvancedSearchGrid({ gridData, addToOrder }) {
  const dataGridRef = React.createRef();
  const dataSource = {
    store: {
      type: "odata",
      key: "Task_ID",
      url: "https://js.devexpress.com/Demos/DevAV/odata/Tasks",
    },
    expand: "ResponsibleEmployee",
    select: [
      "Task_ID",
      "Task_Subject",
      "Task_Start_Date",
      "Task_Due_Date",
      "Task_Status",
      "Task_Priority",
      "Task_Completion",
      "ResponsibleEmployee/Employee_Full_Name",
    ],
  };
  const priorities = [
    { name: "High", value: 4 },
    { name: "Urgent", value: 3 },
    { name: "Normal", value: 2 },
    { name: "Low", value: 1 },
  ];
  return (
    <div className="m-3">
      <DataGrid
        className={"dx-card wide-card"}
        dataSource={gridData}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        keyExpr="ProductNum"
        ref={dataGridRef}
      >
        <Selection
          mode="multiple"
          selectAllMode={"allPages"}
          showCheckBoxesMode={"always"}
        />
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={false} />

        <Column
          dataField={"ProductNum"}
          caption={"Product Number"}
        />
        <Column
          dataField={"Description"}
          // width={190}
          caption={"Description"}
        />
        <Column
          dataField={"StockQty"}
          caption={"Stock Quantity"}
        />
        <Column
          dataField={"Category"}
          caption={"Category"}
        />
        <Column dataField={"Class"} caption={"Class"} />
        <Column
          dataField={"Department"}
          caption={"Department"}
        />
      </DataGrid>
    </div>
  );
}

export default AdvancedSearchGrid;
