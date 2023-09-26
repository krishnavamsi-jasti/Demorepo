import React, { useCallback, useEffect, useRef, useState } from "react";
import "./AdvancedSearchFilterPopup.scss";
import { Button, DataGrid, Popup } from "devextreme-react";
import AdvancedSearchGrid from "../advanced-search-grid/AdvancedSearchGrid";
import SelectBox from "devextreme-react/select-box";
import { TextBox, Button as TextBoxButton } from "devextreme-react/text-box";
import { useDispatch, useSelector } from "react-redux";
import {
  Column,
  FilterRow,
  Pager,
  Paging,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";
import { addSelectedAdvancedRows } from "../../utils/advancedSlice";

function AdvancedSearchFilterPopup({
  showAdvancedSearch,
  setShowAdvancedSearch,
}) {
  const categoryData = useSelector((state) => state.data.categoryData);
  const classData = useSelector((state) => state.data.classData);
  const departmentData = useSelector((state) => state.data.departmentData);
  const productsData = useSelector((state) => state.data.productsData);
  let selectedCategory = useRef(null);
  let selectedClass = useRef(null);
  const dataGridRef = useRef();

  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    class: "",
    department: "",
  });

  const [classDataState, setClassDataState] = useState([]);
  const [productsDataState, setProductsDataState] = useState([]);
  const [departmentDataState, setDepartmentDataState] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // setClassDataState(classData);
    // setProductsDataState(productsData);
    setProductsDataState(productsData);
  }, [productsData]);

  const onCategoryValueChange = (e) => {
    selectedCategory.current = e.value;
    selectedClass.current = null;
    console.log(selectedCategory.current);
    // setSelectedFilters({ ...selectedFilters, category: e.value }, () => {
    //   console.log('State updated', selectedFilters)
    // });
    const filteredClassData = classData.filter(
      (item) => item.CategoryId === e.value
    );
    // console.log(filteredClassData);
    // console.log("classData", classData);
    // console.log("classDataState", classDataState);
    setClassDataState(filteredClassData);
    refreshGridWithFilters();
  };

  const onClassValueChange = (e) => {
    selectedClass.current = e.value;
    console.log(selectedClass.current);
    // setSelectedFilters({ ...selectedFilters, class: e.value }, refreshGridWithFilters);
    // refreshGridWithFilters();
  };

  const refreshGridWithFilters = () => {
    let filteredData = [];
    if (selectedCategory.current) {
      filteredData = productsData
        .filter((product) => {
          if (selectedCategory.current) {
            return product.CategoryId === selectedCategory.current;
          }
          return true;
        })
        .filter((product) => {
          if (selectedClass.current) {
            return product.class === selectedClass.current;
          }
          return true;
        });
    }
    setProductsDataState(filteredData);
  };

  const addToOrder = (close) => {
    const selectedRows = dataGridRef.current._instance.getSelectedRowsData();
    console.log(selectedRows);
    const processedRecords = processSelectedRowsData(selectedRows);
    console.log('processedRecords', processedRecords);
    dispatch(addSelectedAdvancedRows(processedRecords));
    if (close) {
      setShowAdvancedSearch(false);
    }
  };

  const processSelectedRowsData = (selectedProducts) => {
    return selectedProducts.map(item => {
      return {
        ID: item.Id,
        ProductId: item.ProductId,
        AccountCodeDescription: "-",
        Quantity: 1,
        UnitPrice: item.PricePer,
        Amount: item.PricePer * 1,
        UOM: item.Unit,
        Comments: item.comments
      };
    })
  }

  const renderContent = () => {
    // console.log("classData", classData);
    return (
      <div>
        {" "}
        <div className="flex flex-row justify-center">
          <div className="dx-field">
            <div className="dx-field-label">Category:</div>
            <div className="dx-field-value">
              <SelectBox
                items={categoryData}
                inputAttr={""}
                valueExpr="CategoryId"
                displayExpr="Description"
                placeholder="Select Category"
                onValueChanged={onCategoryValueChange}
              />
            </div>
          </div>
          <div className="dx-field ml-2 field-margin">
            <div className="dx-field-label ml-4">Class:</div>
            <div className="dx-field-value">
              <SelectBox
                items={classDataState}
                inputAttr={""}
                valueExpr="ClassId"
                displayExpr="Description"
                placeholder="Select Class"
                onValueChanged={onClassValueChange}
              />
            </div>
          </div>
          <div className="dx-field margin-field field-margin">
            <div className="dx-field-label  ml-4">Department:</div>
            <div className="dx-field-value">
              <SelectBox
                items={departmentDataState}
                inputAttr={""}
                valueExpr="DepartmentId"
                displayExpr="Description"
                placeholder="Select Department"
              />
            </div>
          </div>
        </div>
        {/* <div className="flex flex-row justify-end">
          <div className="dx-field mr-10" style={{ marginRight: "70px" }}>
            <TextBox placeholder="Search...">
              <TextBoxButton
                name="password"
                location="after"
                options={{
                  icon: "https://i.imgur.com/I2udZHG.png",
                  type: "default",
                }}
              />
            </TextBox>
          </div>
        </div> */}
        <div style={{ width: "900px !important" }}>
          {/* <AdvancedSearchGrid gridData={productsDataState} addToOrder={addToOrder} /> */}
          <div className="m-3">
            <DataGrid
              className={"dx-card wide-card"}
              dataSource={productsDataState}
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
                selectAllMode={"page"}
                showCheckBoxesMode={"always"}
              />
              <Paging defaultPageSize={10} />
              <Pager showPageSizeSelector={true} showInfo={true} />
              <FilterRow visible={false} />
              <SearchPanel
                visible={true}
                width={240}
                placeholder="Search..."
              />
              <Column dataField={"ProductNum"} caption={"Product Number"} />
              <Column
                dataField={"Description"}
                // width={190}
                caption={"Description"}
              />
              <Column dataField={"StockQty"} caption={"Stock Quantity"} />
              <Column dataField={"Category"} caption={"Category"} />
              <Column dataField={"Class"} caption={"Class"} />
              <Column dataField={"Department"} caption={"Department"} />
            </DataGrid>
          </div>
          {/*  */}
          <div className="flex justify-end">
            <Button
              className="m-2"
              text="Add to Order"
              onClick={() => addToOrder()}
              type="default"
              stylingMode="contained"
            />
            <Button
              className="m-2"
              text="Add to Order and Close"
              onClick={() => addToOrder(true)}
              type="default"
              stylingMode="contained"
            />
            <Button
              className="m-2"
              text="Cancel"
              onClick={() => setShowAdvancedSearch(false)}
              type="danger"
              stylingMode="contained"
            />
          </div>
        </div>
      </div>
    );
  };
  return (
    <Popup
      showTitle={true}
      title="Advanced Search"
      visible={showAdvancedSearch}
      width={1200}
      // height={500}
      onHiding={() =>
        setShowAdvancedSearch(false)
      }
      contentRender={renderContent}
    />
  );
}

export default AdvancedSearchFilterPopup;
