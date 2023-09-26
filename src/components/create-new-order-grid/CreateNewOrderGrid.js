import React, { useCallback, useEffect, useRef, useState } from "react";
import "./CreateNewOrderGrid.scss";
import "devextreme/data/odata/store";
import DataGrid, {
  Column,
  Editing,
  Paging,
  Lookup,
  Selection,
  Scrolling,
  FilterRow,
  Toolbar,
  Item,
  StateStoring,
  RequiredRule,
} from "devextreme-react/data-grid";
import api from "../../utils/api";
import { useAuth } from "../../contexts/auth";
import DropDownBox, { DropDownOptions } from "devextreme-react/drop-down-box";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  addBudgetAccountStore,
  addCategoryData,
  addClassesData,
  addDepartmentsData,
  addGridDataState,
  addProductsData,
} from "../../utils/dataSlice";
import ProductClickable from "../product-clickable/ProductClickable";
import ProductDetailPopup from "../product-detail-popup/ProductDetailPopup";
import DataSource from "devextreme/data/data_source";
import { addSelectedAdvancedRows } from "../../utils/advancedSlice";
import { createStore } from "devextreme-aspnet-data-nojquery";
import ArrayStore from "devextreme/data/array_store";
import CustomStore from "devextreme/data/custom_store";
import ProductDropdownBoxComponent from "./DropdownBoxComponents/ProductDropdownBoxComponent";
import AccountCodeDropdownBoxComponent from "./DropdownBoxComponents/AccountCodeDropdownBoxComponent";

function onValueChanged(cell, e) {
  if (!e?.value?.fromTemp) {
    if (
      e &&
      e.value &&
      e.value.length > 0 &&
      e?.value[0]?.AccountCodeDescription &&
      e?.previousValue === undefined
    ) {
      console.log("*** onValueChanged 1st If", e);
      cell.setValue(e?.value[0]?.AccountCodeDescription);
      return;
    }
    if (
      e &&
      e.value &&
      e.value.length > 0 &&
      e.previousValue.length > 0 &&
      e?.previousValue &&
      e?.value[0]?.AccountCodeDescription !==
        e?.previousValue[0]?.AccountCodeDescription
    ) {
      console.log("*** onValueChanged 2nd If", e);
      cell.setValue(e?.value[0]?.AccountCodeDescription);
    }
  }
}

function onValueChangedProduct(cell, e) {
  console.log("*** onValueChangedProduct Outer If", e, e.fromGrid);
  // cell.setValue(e?.value[0]?.ProductId);
  if (
    e &&
    e.value &&
    e.value.length > 0 &&
    e?.value[0]?.ProductId &&
    e?.previousValue === undefined
  ) {
    console.log("*** onValueChangedProduct 1st If", e);
    cell.setValue(e?.value[0]?.ProductId);
    return false;
  }
  if (
    e &&
    e.value &&
    e.value.length > 0 &&
    e.previousValue &&
    e.previousValue.length > 0 &&
    e?.previousValue &&
    e?.value[0]?.ProductId !== e?.previousValue[0]?.ProductId
  ) {
    console.log("*** onValueChangedProduct 2nd If", e);
    cell.setValue(e?.value[0]?.ProductId);
    return false;
  }
}

const CreateNewOrderGrid = () => {
  const gridRef = useRef();
  const { user } = useAuth();
  const [gridData, setGridData] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [product, setProduct] = useState();
  const [budgetAccount, setBudgetAccount] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [classesList, setClassesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedBudgetAccount, setSelectedBudgetAccount] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [isGridBoxOpened, setIsGridBoxOpened] = useState(false);
  const [isProductGridBoxOpened, setIsProductGridBoxOpened] = useState(false);
  const [showProductDetailPopup, setShowProductDetailPopup] = useState({
    display: false,
    data: [],
    selectedProductId: null,
  });
  const gridDataSource = new DataSource({
    // ...
  });
  const dropDownBoxRef = useRef(null);
  const dispatch = useDispatch();
  const url = "https://js.devexpress.com/Demos/Mvc/api/CustomEditors";

  const employees = createStore({
    key: "ID",
    loadUrl: `${url}/Employees`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  const tasks = createStore({
    key: "ID",
    loadUrl: `${url}/Tasks`,
    updateUrl: `${url}/UpdateTask`,
    insertUrl: `${url}/InsertTask`,
    onBeforeSend(method, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });

  const gridMainDataSourceStore = new DataSource({
    store: {
      type: "array",
      key: "ID",
      data: [],
    },
  });

  const productsDataSourceStore = {
    store: new CustomStore({
      key: "ProductId",
      loadMode: "raw",
      load: () => {
        // Returns an array of objects that have the following structure:
        // { id: 1, name: "John Doe" }
        return productsList;
      },
    }),
  };

  const budgetAccountStore = {
    store: new CustomStore({
      key: "AccountCode",
      loadMode: "raw",
      load: () => {
        // Returns an array of objects that have the following structure:
        // { id: 1, name: "John Doe" }
        return budgetAccount;
      },
    }),
  };

  const advancedRecords = useSelector((state) => {
    console.log(
      "Order data received",
      state.advancedSlice.selectedAdvancedRows
    );
    return state.advancedSlice.selectedAdvancedRows;
  });

  const productsListCache = useSelector((state) => {
    console.log("productsListCache received", state.data.productsData);
    // if (!productsList) {
    //   setProductsList(state.data.productsData);
    // }
    return state.data.productsData;
  });

  useSelector((state) => {
    console.log("gridStateRecords data received", state.data.gridDataState);
    if (gridData.length === 0 && state.data.gridDataState.length) {
      // setGridData([...state.data.gridDataState]);
      console.log("gridStateRecords data updated");

      let newData = [];
      let dataToUpdate = [...state.data.gridDataState];
      if (dataToUpdate.length) {
        [...dataToUpdate].forEach((device, index) => {
          newData[index] = { ...device };
          setGridData([...newData]);
        });
        dispatch(addSelectedAdvancedRows([]));
      }
    }
    return state.data.gridDataState;
  });

  useEffect(() => {
    console.log("advancedRecords updated", advancedRecords);
    console.log(gridRef);
    console.log("useEffect called");
    // insertRowRemote(advancedRecords[0]);

    // setGridData([...gridData, ...advancedRecords]);
    let newData = [];
    if (advancedRecords.length) {
      [...gridData, ...advancedRecords].forEach((device, index) => {
        newData[index] = { ...device };
        setGridData([...newData]);
      });
      dispatch(addSelectedAdvancedRows([]));
    }

    return () => {
      console.log("Unmount");
      // dispatch(addSelectedAdvancedRows([]));
      // console.log(gridRef.current._instance.getDataSource());
    };
  }, [advancedRecords]);

  useEffect(() => {
    console.log("gridData updated", gridData);
    dispatch(addGridDataState([]));
    console.log("on Saved");
    console.log(gridRef.current._instance.getDataSource()._items);

    let gridStateData = [];
    let gridCurrentData = [...gridData];
    gridCurrentData.forEach((device, index) => {
      gridStateData[index] = { ...device };
    });
    dispatch(addGridDataState(gridStateData));
  }, [gridData]);

  const onValueChangedBudget = useCallback(onValueChanged, []);

  useEffect(() => {
    // if (!(productsListCache && productsListCache.length)) {
    fetch(api.url + "Product/GetAvailableProductsAsync/?siteid=100", {
      method: "GET",
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProductsList(data);
        console.log("Disptach addProductsData called");
        dispatch(addProductsData(data));
      })
      .catch((error) => console.log(error));
    // }

    fetch(api.url + "BudgetAccount/GetActiveAsync", {
      method: "GET",
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBudgetAccount(data);
      })
      .catch((error) => console.log(error));

    fetch(api.url + "BudgetCode/GetActiveAsync", {
      method: "GET",
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(addBudgetAccountStore(data));
      })
      .catch((error) => console.log(error));

    fetch(api.url + "Product/GetCategoriesAsync", {
      method: "GET",
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCategoriesList(data);
        console.log("Disptach addCategoryData called");
        dispatch(addCategoryData(data));
      })
      .catch((error) => console.log(error));

    fetch(api.url + "Product/GetClassesAsync", {
      method: "GET",
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setClassesList(data);
        console.log("Disptach addClassesData called");
        dispatch(addClassesData(data));
      })
      .catch((error) => console.log(error));

    fetch(api.url + "Product/GetDepartmentsAsync", {
      method: "GET",
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDepartmentsList(data);
        console.log("Disptach addDepartmentsData called");
        dispatch(addDepartmentsData(data));
      })
      .catch((error) => console.log(error));
  }, []);

  const onRowSaveClick = (e) => {
    dispatch(addGridDataState([]));
    console.log("on Saved");
    console.log(gridRef.current._instance.getDataSource()._items);

    let gridStateData = [];
    let gridCurrentData = [...gridRef.current._instance.getDataSource()._items];
    gridCurrentData.forEach((device, index) => {
      gridStateData[index] = { ...device };
    });
    dispatch(addGridDataState(gridStateData));
  };

  const dataGridOnSelectionChanged = (e) => {
    console.log("Accounts dataGridOnSelectionChanged");
    console.log(e);
    // setIsGridBoxOpened(true);
    if (e.selectedRowKeys.length) {
      setSelectedBudgetAccount(e.selectedRowKeys);
    }
  };

  const productGridOnSelectionChanged = (e) => {
    console.log("Product productGridOnSelectionChanged");
    console.log(e);
    // setIsProductGridBoxOpened(true);
    console.log(
      "***",
      e.selectedRowKeys.length,
      e.currentDeselectedRowKeys.length
    );
    if (e.selectedRowKeys.length) {
      setSelectedProduct(e.selectedRowKeys);
    }
  };
  const onProductGridBoxOpened = (e) => {
    if (e.name === "opened") {
      // setIsProductGridBoxOpened(e.value);
    }
  };

  const gridBoxDisplayExpr = (item) => {
    return item && `${item.AccountCodeDescription} - ${item.AccountCode}`;
  };

  const statusEditorRender = (cell) => {
    const onValueChangedRef = onValueChanged.bind(this, cell);
    return (
      // <SelectBox dataSource={budgetAccount}
      //             displayExpr={gridBoxDisplayExpr}
      //             searchEnabled={true}
      //             searchMode={"contains"}
      //             searchExpr={"AccountCodeDescription"}
      //             searchTimeout={200}
      //             minSearchLength={0}
      //             contentRender={dataGridRender}
      //             showDataBeforeSearch={false} >
      //         </SelectBox>
      <DropDownBox
        // acceptCustomValue={true}
        value={selectedBudgetAccount}
        deferRendering={false}
        displayExpr={gridBoxDisplayExpr}
        placeholder="Select a value..."
        // showClearButton={true}
        dataSource={budgetAccount}
        contentRender={dataGridRender}
        onValueChanged={onValueChangedRef}
        onKeyUp={() => {
          console.log("On Change ****");
        }}
        // onValueChanged={(e) => setSelectedBudgetAccount(e.value)}
        // onOptionChanged={onGridBoxOpened}
      />
    );
  };

  const productEditorRender = (cell) => {
    const onValueChangedRef = onValueChangedProduct.bind(this, cell);
    return (
      <DropDownBox
        id="productDropdown"
        ref={dropDownBoxRef}
        value={selectedProduct}
        deferRendering={false}
        displayExpr={productBoxDisplayExpr}
        dropDownButtonRender={(e) => {
          console.log("Dropdown Render");
        }}
        placeholder="Select a value..."
        dataSource={productsList}
        contentRender={productDataGridRender}
        onValueChanged={onValueChangedRef}
        onOptionChanged={onProductGridBoxOpened}
      ></DropDownBox>
    );
  };

  const productBoxDisplayExpr = (item) => {
    return item && `${item.ProductId} - ${item.Description}`;
  };

  const productItemRender = (data) => {
    if (data != null) {
      return (
        <div>
          <div style={{ display: "table" }}>
            <div style={{ display: "table-row" }}>
              <div style={{ display: "table-cell" }}>{data.Description}</div>
              <div style={{ display: "table-cell" }}>{data.Category}</div>
              <div style={{ display: "table-cell" }}>{data.CategoryId}</div>
            </div>
          </div>
        </div>
      );
    }
    return <span>(All)</span>;
  };

  const columns = ["AccountCode", "AccountCodeDescription"];
  const productColumns = ["ProductNum", "Description", "StockQty"];

  const dataGridRender = () => {
    return (
      <DataGrid
        dataSource={budgetAccount}
        columns={columns}
        hoverStateEnabled={true}
        selectedRowKeys={selectedBudgetAccount}
        onRowClick={() => {
          console.log("*** onRowClick");
        }}
        onSelectionChanged={dataGridOnSelectionChanged}
        height="100%"
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  };

  const productDataGridRender = () => {
    return (
      <DataGrid
        dataSource={productsList}
        columns={productColumns}
        hoverStateEnabled={true}
        selectedRowKeys={selectedProduct}
        onSelectionChanged={productGridOnSelectionChanged}
        height="100%"
      >
        <Selection mode="single" />
        <Scrolling mode="virtual" />
        <Paging enabled={true} pageSize={10} />
        <FilterRow visible={true} />
      </DataGrid>
    );
  };

  const ProductClickable = (cellData) => {
    return (
      <div>
        <div
          className="product-name"
          onClick={() => {
            setShowProductDetailPopup({
              display: true,
              data: productsList,
              selectedProductId: cellData.value,
            });
          }}
        >
          {cellData.displayValue}
        </div>
      </div>
    );
  };

  const calculateTotalAmount = useCallback((rowData) => {
    console.log("calculateTotalAmount");
    if (rowData.UnitPrice && rowData.Quantity) {
      return rowData.UnitPrice * rowData.Quantity;
    }
    return;
  });

  const populateUnitPrice = (rowData) => {
    console.log("populateUnitPrice");
    if (rowData && rowData.ProductId) {
      const selectedProduct = getProductPriceByProductId(rowData.ProductId);
      if (selectedProduct) {
        // setGridData([...gridData, {...rowData,UnitPrice :  selectedProduct.PricePer}])
        return selectedProduct.PricePer;
      }
    }
    return;
  };

  const getProductPriceByProductId = useCallback((ProductId) => {
    let price = 0;
    if (productsList) {
      const selectedProduct = productsList.find(
        (item) => item.ProductId === ProductId
      );
      price = selectedProduct.PricePer;
      return price;
    }
    return price;
  });

  return (
    <div className="m-3 create-new-order-grid">
      <DataGrid
        id="gridContainer"
        ref={gridRef}
        dataSource={gridData}
        keyExpr="ID"
        allowColumnReordering={true}
        showBorders={true}
        onSaved={onRowSaveClick.bind(this)}
        onInitNewRow={() => {
          console.log("*** onInitNewRow");
        }}
        onRowUpdating={(e) => {
          console.log("onRowUpdating ****", e);
          if (e.data && e.data.ProductId) {
            e.data.UnitPrice = getProductPriceByProductId(e.data.ProductId);
          }
        }}
        onRowInserting={(e) => {
          console.log("onRowInserting ****", e);
          if (e.data && e.data.ProductId) {
            e.data.UnitPrice = getProductPriceByProductId(e.data.ProductId);
          }
        }}
      >
        <Paging defaultPageSize={10} />
        <Paging enabled={true} />
        <Editing
          mode="row"
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <Column
          dataField="ProductId"
          caption="Product"
          width={300}
          editCellComponent={ProductDropdownBoxComponent}
          cellRender={ProductClickable}
        >
          <RequiredRule />
          <Lookup
            dataSource={productsDataSourceStore}
            displayExpr="Description"
            valueExpr="ProductId"
          />
        </Column>
        <Column
          dataField={"ProductUnitPrice"}
          caption={"ProductUnitPrice"}
          allowEditing={true}
          visible={false}
        />
        <Column
          dataField="AccountCode"
          caption="Account Code"
          editCellComponent={AccountCodeDropdownBoxComponent}
          width={250}
        >
          <Lookup
            dataSource={budgetAccountStore}
            displayExpr="AccountCodeDescription"
            valueExpr="AccountCode"
            placeholder="Select employee"
          ></Lookup>
        </Column>
        <Column dataField={"Quantity"} caption={"Quantity"} dataType="number">
          <RequiredRule />
        </Column>
        <Column
          dataField={"UnitPrice"}
          caption={"Unit Price"}
          // calculateCellValue={populateUnitPrice}
          allowEditing={false}
        />
        <Column
          dataField={"Amount"}
          caption={"Amount"}
          allowEditing={false}
          calculateCellValue={calculateTotalAmount}
        />
        <Column dataField={"UOM"} caption={"UOM"} allowEditing={false} />
        <Column
          dataField={"Comments"}
          caption={"Comments"}
          allowEditing={false}
        />

        <Toolbar>
          <Item name="addRowButton" showText="always" />
        </Toolbar>
      </DataGrid>
      {/* ProductDetailPopup */}
      <ProductDetailPopup
        showProductDetailPopup={showProductDetailPopup}
        setShowProductDetailPopup={setShowProductDetailPopup}
      />
    </div>
  );
};

export default React.memo(CreateNewOrderGrid);
