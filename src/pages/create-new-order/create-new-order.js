import React, { useEffect, useState } from "react";
import "./create-new-order.scss";
import { useAuth } from "../../contexts/auth";
import api from "../../utils/api";
import { Button, DropDownBox, SelectBox, TextArea } from "devextreme-react";
import {
  AdvancedSearchFilterPopup,
  CreateNewOrderGrid,
  NewOrderPopup,
  PageTitleHeader,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import notify from "devextreme/ui/notify";
import BudgetCodeDropdownBoxComponent from "../../components/create-new-order-grid/DropdownBoxComponents/BudgetCodeDropdownBoxComponent";
import { addGridDataState, addShippingAddresses } from "../../utils/dataSlice";

const CreateNewOrder = () => {
  const { user } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [shippingAddresss, setShippingAddresss] = useState();
  const [shippingAddress, setShippingAddress] = useState();
  const [selectedBudget, setSelectedBudget] = useState();
  const [orderComments, setOrderComments] = useState();
  const [budgetCodeStore, setBudgetCodeStore] = useState([]);
  const simpleProductLabel = { "aria-label": "CompanyName" };
  const dispatch = useDispatch();
  const gridData = useSelector((state) => {
    return state.data.gridDataState;
  });
  const budgetCodesStore = useSelector((state) => {
    return state.data.budgetAccountState;
  });

  const productsListStore = useSelector((state) => {
    return state.data.productsData;
  });

  const getShipAddressInfoAsync = async () => {
    const shippingAddresses = await fetch(
      api.url +
        "ShipAddress/GetShipAddressInfoAsync/?clientid=" +
        user.ClientId,
      {
        method: "GET",
        headers: {
          APP_KEY: user.appKey,
          "ZUMO-API-VERSION": "2.0.0",
        },
      }
    ).then((response) => response.json());
    setShippingAddresss(shippingAddresses);
    dispatch(addShippingAddresses(shippingAddresses));
  };

  useEffect(() => {
    getShipAddressInfoAsync();
    //
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
        // dispatch(addBudgetAccountStore(data));
        console.log("budgetCodeStore data received");
        setBudgetCodeStore(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const addNewShippingAddress = () => {
    setShowPopup(true);
  };

  const handleOnValueChange = (e) => {
    setShippingAddress(e.value);
  };

  const processOrderReqObject = (gridData) => {
    const finalObj = {};
    let itemsArray = [];
    gridData.forEach((item) => {
      var obj = {
        [item.ProductId]: item.Quantity,
      };
      itemsArray.push(obj);
    });
    finalObj["Items"] = itemsArray;
    finalObj["Terminal"] = 0;
    finalObj["TerminalId"] = user.appIdData.portalTerminalId;
    finalObj["SiteId"] = 100;
    finalObj["TerminalAppKey"] = user.appIdData.appKey;
    finalObj["Email"] = user.EmployeeEmail;
    finalObj["UserName"] = user.UserId;

    return finalObj;
  };

  const showMessage = (message, type) => {
    notify(
      {
        message: message,
        width: 230,
        position: "top right",
        // direction: 'left-push'
      },
      type,
      500
    );
  };

  const peformInsertOrder = () => {
    const orderPayload = {
      Terminal: 0,
      TerminalId: user.appIdData.portalTerminalId,
      SiteId: 100,
      Items: [
        {
          Id: "d1ee60eb-8179-44a7-982e-f4994572eb83",
          OrderId: 0,
          ClientId: user.ClientId,
          NativeSiteId: 100,
          Site: "100",
          TransferDestSiteId: null,
          TransferSupplySiteId: null,
          OrderDate: new Date().toISOString(),
          OrderPayStatusId: 1,
          Comments: orderComments,
          OrderOriginId: 5, //
          OrderPriorityId: 1, //
          OrderTypeId: 1, //
          TransferStatusId: null,
          PermitBackOrder: 0,
          DeliveryDate: null,
          ProcessDate: null,
          ProcessOrderEmpId: null,
          CancellationDate: null,
          EntryClerkId: 418, //
          DueDays: 0,
          TermsId: 100, //
          OrderStatusId: 33, //
          BackOrdInvoiceId: 0,
          DefaultPriceId: 1, //
          DiscountPerscent: 0.0,
          ShipAddId: shippingAddress?.ShipId,
          PersonPlacedOrder: user.EmployeeName,
          PersonApprovedOrder: null,
          ClientPoNum: "",
          TerminalNum: user.appIdData.portalTerminalId,
          SalesmanId: null,
          NativeCurrencyId: 1,
          CurrencyId: 1,
          ExchangeRate: 0.0,
          Subtotal: getTotalOrderValue(gridData),
          Discount: 0.0,
          AddCharge1: 0.0,
          AddCharge2: 0.0,
          AddCharge3: 0.0,
          TaxAmount1: 0.0,
          TaxAmount2: 0.0,
          TaxAmount3: 0.0,
          Charge1TaxAmount1: 0.0,
          Charge1TaxAmount2: 0.0,
          Charge1TaxAmount3: 0.0,
          Charge2TaxAmount1: 0.0,
          Charge2TaxAmount2: 0.0,
          Charge2TaxAmount3: 0.0,
          Charge3TaxAmount1: 0.0,
          Charge3TaxAmount2: 0.0,
          Charge3TaxAmount3: 0.0,
          DiscountTaxAmount1: 0.0,
          DiscountTaxAmount2: 0.0,
          DiscountTaxAmount3: 0.0,
          TotalOrder: getTotalOrderValue(gridData),
          TransportId: null,
          NoPackage: 0,
          Weight: 0.0,
          Volume: 0.0,
          ShipTrackNo: "",
          Total: 0.0,
          TransactionId: "",
          ClientGuid: null,
          DiscountNote: "",
          CashierName: "",
          CustomerName: "",
          Terminal: "",
          BudgetCode: selectedBudget[0],
          ScaId: null,
          SaleTime: null,
          Payments: null,
          OrderLines: generateOrderLinesForSubmit(gridData),
        },
      ],
      TerminalAppKey: user.appIdData.appKey,
      Email: "",
      UserName: "",
    };
    console.log(orderPayload);

    fetch(api.url + "Portal/InsertOrder", {
      method: "POST",
      body: JSON.stringify(orderPayload),
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        dispatch(addGridDataState([]));
        showMessage("Order successfully created", "success");
      })
      .catch((error) => {
        showMessage("Order creation failed", "error");
        console.log(error);
      });
  };

  const getTotalOrderValue = (gridData) => {
    let totalValue = 0;
    gridData.forEach((item) => {
      const selectedProduct = productsListStore.find(
        (listItem) => listItem.ProductId === item.ProductId
      );
      totalValue = totalValue + selectedProduct.PricePer * item.Quantity;
    });
    return totalValue;
  };

  const generateOrderLinesForSubmit = (gridData) => {
    let outputLines = [];
    gridData.forEach((item) => {
      const selectedProduct = productsListStore.find(
        (listItem) => listItem.ProductId === item.ProductId
      );
      const lineObj = {
        Id: item.ID, //
        OrderId: 0,
        OrderLineId: 0,
        LineId: null,
        ProductId: item.ProductId,
        OrdQty: item.Quantity,
        UnitPrice: selectedProduct.PricePer,
        PricePer: selectedProduct.PricePer,
        GlSalesId: null,
        TaxRate1: null,
        TaxRate2: null,
        TaxRate3: null,
        Tax1Taxable2: null,
        Tax1Taxable3: null,
        Tax2Taxable3: null,
        Comments: selectedProduct.Comments,
        PriceStatusId: selectedProduct.StatusId,
        InstId: selectedProduct.NatureId,
        TotalQty: null,
        ProductNumber: selectedProduct.BarCode,
        ProductDesc: selectedProduct.Description,
        BarCode: selectedProduct.BarCode,
        UnitDesc: "",
        ProductGuid: selectedProduct.Id,
        DiscountNote: "",
        DiscountAmount: null,
        DiscountPer: null,
        AccountCode: gridData.AccountCode,
        UomPrice: null,
        UomQty: null,
        OriginalUomQty: null,
        UomName: selectedProduct.Unit,
        PrdUomId: null,
        ScaLineId: null,
      };
      outputLines.push(lineObj);
    });

    return outputLines;
  };

  const checkForFieldsValidation = () => {
    if (!shippingAddress) {
      showMessage("Shipping address is missing!", "error");
      return false;
    }
    if (selectedBudget === undefined || selectedBudget?.length === 0) {
      showMessage("Budget code is missing!", "error");
      return false;
    }
    if (gridData.length === 0) {
      showMessage("No products are added!", "error");
      return false;
    }
    return true;
  };

  const submitOrderHandler = () => {
    // alert("submitOrderHandler");
    if (checkForFieldsValidation()) {
      console.log(gridData);
      const reqObj = processOrderReqObject(gridData);
      // Validate Quantity
      fetch(api.url + "Portal/ValidateQuantity", {
        method: "POST",
        body: JSON.stringify(reqObj),
        headers: {
          APP_KEY: user.appKey,
          "ZUMO-API-VERSION": "2.0.0",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.IsSuccessful) {
            peformInsertOrder();
          }
        })
        .catch((error) => console.log(error));
    }
  };

  const updateOrderCommentsState = (e) => {
    console.log("updateOrderCommentsState", e);
    setOrderComments(e.event.originalEvent.target.value);
  };

  return (
    <>
      {/* Page Title Sub Header */}
      <PageTitleHeader
        title="Create New Order"
        submitOrder={true}
        submitOrderAction={submitOrderHandler}
      />
      <div className="shipping-parent">
        <div className="shipping-input-containers bg-white">
          <div className="shipping-address-container">
            <div className="dx-fieldset-header shipping-address-title">
              Shipping Address
            </div>
            <div className="form flex">
              <div className="dx-fieldset shipping-padding">
                <div className="flex"></div>
                <div className="dx-field">
                  <div className="dx-field-label">Name:</div>
                  <div className="dx-field-value flex justify-between">
                    <SelectBox
                      placeholder="Choose Name"
                      dataSource={shippingAddresss}
                      inputAttr={simpleProductLabel}
                      displayExpr="CompanyName"
                      // valueExpr="Address"
                      onValueChanged={handleOnValueChange}
                    ></SelectBox>
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Address:</div>
                  <div className="dx-field-value">
                    <TextArea
                      height={90}
                      value={shippingAddress?.Address}
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>
              {/* <div className="dx-fieldset shipping-padding">
                <div className="dx-field">
                  <Button
                    text="Add New"
                    type="default"
                    icon="plus"
                    onClick={addNewShippingAddress}
                  />
                </div>
              </div> */}
            </div>
          </div>

          <div className="shipping-separator"></div>
          <div className="shipping-address-container">
            <div className="form">
              <div className="dx-fieldset shipping-padding">
                <div className="dx-fieldset-header delivery-details-text">
                  Order Comments
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Budget Code:</div>
                  <div className="dx-field-value">
                    {budgetCodeStore.length ? (
                      <BudgetCodeDropdownBoxComponent
                        budgetCodeStore={budgetCodeStore}
                        setSelectedBudget={setSelectedBudget}
                      />
                    ) : (
                      <DropDownBox
                        placeholder="Select a value..."
                        showClearButton={false}
                        dataSource={[]}
                        disabled={true}
                      />
                    )}
                  </div>
                </div>
                <div className="dx-field">
                  <div className="dx-field-label">Comments:</div>
                  <div className="dx-field-value">
                    <TextArea
                      height={90}
                      value={orderComments}
                      onChange={updateOrderCommentsState}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end bg-white advanced-buttons-row">
          <div className="mr-[30px]">
            <Button
              text="Advanced Search"
              type="default"
              stylingMode="contained"
              className="mr-[10px]"
              icon="filter"
              onClick={() => setShowAdvancedSearch(true)}
            />
            <Button
              text="Print"
              type="normal"
              stylingMode="contained"
              icon="print"
              onClick={() => window.print()}
            />
          </div>
        </div>
        <div></div>
      </div>
      {/* <div>
        <div className="flex justify-end pr-[20px] mr-[-60px]">
          <Button
            text="Advanced Search"
            type="default"
            stylingMode="contained"
            className="mr-[10px]"
            icon="filter"
            onClick={() => setShowAdvancedSearch(true)}
          />
          <Button
            text="Print"
            type="normal"
            stylingMode="contained"
            icon="print"
            onClick={() => window.print()}
          />
        </div>
      </div> */}
      {/* Popup */}
      <NewOrderPopup showPopup={showPopup} setShowPopup={setShowPopup} />
      {/* <div className="flex justify-end pr-[20px] mt-[10px]">
        <Button
          text="Advanced Search"
          type="default"
          stylingMode="contained"
          className="mr-[10px]"
          icon="filter"
          onClick={() => setShowAdvancedSearch(true)}
        />
        <Button
          text="Print"
          type="normal"
          stylingMode="contained"
          icon="print"
          onClick={() => window.print()}
        />
      </div> */}
      <AdvancedSearchFilterPopup
        showAdvancedSearch={showAdvancedSearch}
        setShowAdvancedSearch={setShowAdvancedSearch}
      />
      {/* Grid Code Starts */}
      <CreateNewOrderGrid />
    </>
  );
};

export default CreateNewOrder;
