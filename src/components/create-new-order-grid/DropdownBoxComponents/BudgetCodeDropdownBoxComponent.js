import React from "react";
import DropDownBox from "devextreme-react/drop-down-box";
import TreeView from "devextreme-react/tree-view";
import DataGrid, {
  Selection,
  Paging,
  FilterRow,
  Scrolling,
} from "devextreme-react/data-grid";
import CustomStore from "devextreme/data/custom_store";
import "whatwg-fetch";
import api from "../../../utils/api";

const gridColumns = ["BudgetCodeNo", "CodeDescription"];
const dropDownOptions = { width: 500 };
class BudgetCodeDropdownBoxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.gridDataSource = this.makeAsyncDataSource(this.props.budgetCodeStore);
    this.state = {
      gridBoxValue: [3],
      isGridBoxOpened: false,
    };
    this.syncDataGridSelection = this.syncDataGridSelection.bind(this);
    this.dataGridOnSelectionChanged =
      this.dataGridOnSelectionChanged.bind(this);
    this.dataGridRender = this.dataGridRender.bind(this);
    this.onGridBoxOpened = this.onGridBoxOpened.bind(this);
  }

  makeAsyncDataSource(array) {
    return new CustomStore({
      loadMode: "raw",
      key: "BudgetCodeId",
      load() {
        // console.log('this.props.budgetCodeStore', this.props.budgetCodeStore)
        return array;
      },
    });
  }

  render() {
    return (
      <DropDownBox
        value={this.state.gridBoxValue}
        opened={this.state.isGridBoxOpened}
        valueExpr="BudgetCodeId"
        deferRendering={false}
        displayExpr={this.gridBoxDisplayExpr}
        placeholder="Select a value..."
        showClearButton={false}
        dropDownOptions={dropDownOptions}
        dataSource={this.gridDataSource}
        onValueChanged={this.syncDataGridSelection}
        onOptionChanged={this.onGridBoxOpened}
        contentRender={this.dataGridRender}
      />
    );
  }

  dataGridRender() {
    return (
      <DataGrid
        dataSource={this.gridDataSource}
        columns={gridColumns}
        hoverStateEnabled={true}
        selectedRowKeys={this.state.gridBoxValue}
        onSelectionChanged={this.dataGridOnSelectionChanged}
        height="100%"
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  }

  syncDataGridSelection(e) {
    this.setState({
      gridBoxValue: e.value,
    });
  }

  dataGridOnSelectionChanged(e) {
    this.setState({
      gridBoxValue: e.selectedRowKeys,
      isGridBoxOpened: false,
    });
    this.props.setSelectedBudget(e.selectedRowKeys)
  }

  gridBoxDisplayExpr(item) {
    return item && `${item.CodeDescription}`;
  }

  onGridBoxOpened(e) {
    if (e.name === "opened") {
      this.setState({
        isGridBoxOpened: e.value,
      });
    }
  }
}

export default BudgetCodeDropdownBoxComponent;
