import React from "react";
import DataGrid, {
  Column,
  FilterRow,
  Paging,
  Scrolling,
  Selection,
} from "devextreme-react/data-grid";
import DropDownBox from "devextreme-react/drop-down-box";

const dropDownOptions = { width: 500 };
const ownerLabel = { "aria-label": "Owner" };

export default class ProductDropdownBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [props.data.value],
      isDropDownOpened: false,
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.contentRender = this.contentRender.bind(this);
    this.boxOptionChanged = this.boxOptionChanged.bind(this);
  }

  boxOptionChanged(e) {
    if (e.name === "opened") {
      this.setState({
        isDropDownOpened: e.value,
      });
    }
  }

  contentRender() {
    return (
      <DataGrid
        dataSource={this.props.data.column.lookup.dataSource}
        remoteOperations={false}
        height={250}
        selectedRowKeys={this.state.selectedRowKeys}
        hoverStateEnabled={false}
        onSelectionChanged={this.onSelectionChanged}
        focusedRowEnabled={false}
        // defaultFocusedRowKey={this.state.selectedRowKeys[0]}
      >
        <FilterRow visible={true} />
        <Column dataField="BarCode" />
        <Column dataField="Description" />
        <Column dataField="StockQty" />
        <Paging enabled={true} defaultPageSize={10} />
        <Scrolling mode="virtual" />
        <Selection mode="single" />
      </DataGrid>
    );
  }

  filterByCost = () => {
    this.dataGrid.filter([
        [ "Cost", ">", 1000 ],
        "and",
        [ "Cost", "<=", 2000 ]
    ]);
}

  onSelectionChanged(selectionChangedArgs) {
    if (selectionChangedArgs.selectedRowKeys.length) {
      this.setState({
        selectedRowKeys: selectionChangedArgs.selectedRowKeys,
        isDropDownOpened: false,
      });
      this.props.data.setValue(selectionChangedArgs.selectedRowKeys[0]);
      if (
        this.props &&
        this.props.data &&
        this.props.data.row &&
        this.props.data.row.cells &&
        this.props.data.row.cells.length &&
        this.props.data.row.cells[3] &&
        this.props?.data?.row?.cells[3].setValue
      ) {
        // this.props.data.row.cells[3].column.allowEditing = true;
        // this.props?.data?.row?.cells[3].setValue(999);
      }
    }
  }

  onCustomSearch(e) {
    if (this) {
      this.setState({
        isDropDownOpened: true
      });
      console.log(e)

      this.filterByCost();
    }
  }

  render() {
    return (
      <DropDownBox
        onOptionChanged={this.boxOptionChanged}
        opened={this.state.isDropDownOpened}
        dropDownOptions={dropDownOptions}
        dataSource={this.props.data.column.lookup.dataSource}
        value={this.state.selectedRowKeys[0]}
        displayExpr="Description"
        valueExpr="ProductId"
        inputAttr={ownerLabel}
        placeholder="Select Product"
        // acceptCustomValue={true}
        focusStateEnabled={false}
        contentRender={this.contentRender}
        // onInput={this.onCustomSearch.bind(this)}
      ></DropDownBox>
    );
  }
}
