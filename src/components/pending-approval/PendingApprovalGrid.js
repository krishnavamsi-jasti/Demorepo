import React, { useEffect, useState } from "react";
import "./PendingApproval.scss";
import "devextreme/data/odata/store";
import api from "../../utils/api";
import { useAuth } from "../../contexts/auth";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Toolbar,
  Item,
  Grouping,
  SearchPanel,
  Lookup,
} from "devextreme-react/data-grid";
import { PageTitleHeader } from "../../components";
import PendingOrderDetailPopup from "../pending-order-detail-popup/PendingOrderDetailPopup";
import { Button } from "devextreme-react";
import { custom } from "devextreme/ui/dialog";
import CustomStore from "devextreme/data/custom_store";
import { useSelector } from "react-redux";

const PendingApprovalGrid = ({ hideSearch, pageSize = 100 }) => {
  const { user } = useAuth();
  // let appKey = '126b7e01-afcb-4065-bee4-04a600bda899';
  // let clientId = user.ClientId | '470';
  const [shippingAddresses, setShippingAddresses] = useState([]);

  let reqObj = {
    Type: null,
    RequestType: 0,
    OrderId: null,
    OrderNo: null,
    FacilityName: null,
    InmateBed: null,
    InmateArea: null,
    InmateHousingUnit: null,
    InmateBookingNo: null,
    Cell: null,
    OrdersStatus: [33],
    TransactionId: null,
    From: null,
    To: null,
    ClientSearchText: null,
    ProductSearchText: null,
    ClientId: user.ClientId,
    CashierId: null,
    ProductId: null,
    PageSize: pageSize,
    Page: 1,
    SiteId: 100,
    TerminalId: null,
  };
  const [data, setData] = useState();
  const [showPendingOrderDetailPopup, setShowPendingOrderDetailPopup] =
    useState({
      display: false,
      data: [],
      selectedOrderId: null,
    });
    

  const shippingAddressesStore = {
    store: new CustomStore({
      key: "ShipId",
      loadMode: "raw",
      load: () => {
        // Returns an array of objects that have the following structure:
        // { id: 1, name: "John Doe" }
        return shippingAddresses;
      },
    }),
  };
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
    setShippingAddresses(shippingAddresses);
  };

  useEffect(() => {
    getShipAddressInfoAsync();
  }, []);

  useEffect(() => {
    fetch(api.url + "Orders/GetOrdersAsync", {
      method: "POST",
      body: JSON.stringify(reqObj),
      // body: JSON.stringify({
      //   "ClientId": '407',//user.ClientId,
      //   "OrdersStatus": [33]
      // }),
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error));
  }, []);

  const onHandleApprove = (e) => {
    console.log(e);
    let myDialog = custom({
      title: "Order Action",
      showTitle: false,
      messageHtml:
        "<div style='width: 400px;'><div><img src='https://i.imgur.com/8mflpqR.png' style='height: 50px'/></div><div style='      margin-top: 10px;     font-weight: bold;       font-family: Roboto;       font-size: 20px;       font-weight: 500;       line-height: 28px;       letter-spacing: 0em;       text-align: left;   '>Confirm this order?</div><p style='     margin-top: 10px;      font-family: Roboto;       font-size: 14px;       font-weight: 400;       line-height: 22px;       letter-spacing: 0em;       text-align: left;   '>Are you sure you want to confirm this order?</p></div>      ",
      buttons: [
        {
          text: "No, Cancel",
          type: "default",
          stylingMode: "contained",
          onClick: (e) => {
            return { buttonText: e.component.option("text") };
          },
        },
        {
          text: "Yes, I'm sure",
          stylingMode: "contained",
          type: "danger",
          onClick: (e) => {
            return { buttonText: e.component.option("text") };
          },
        },
      ],
    });
    myDialog.show().then((dialogResult) => {
      console.log(dialogResult.buttonText);
    });
  };

  const onHandleDeny = (e) => {
    console.log(e);
    let myDialog = custom({
      title: "Order Action",
      showTitle: false,
      messageHtml:
        "<div style='width: 400px;'><div><img src='https://i.imgur.com/le3yRtv.png' /></div><div style='      margin-top: 10px;     font-weight: bold;       font-family: Roboto;       font-size: 20px;       font-weight: 500;       line-height: 28px;       letter-spacing: 0em;       text-align: left;   '>Deny this order?</div><p style='     margin-top: 10px;      font-family: Roboto;       font-size: 14px;       font-weight: 400;       line-height: 22px;       letter-spacing: 0em;       text-align: left;   '>Are you sure you want to deny this order? This action cannot be undone.</p></div>      ",
      buttons: [
        {
          text: "No, Cancel",
          type: "default",
          stylingMode: "contained",
          onClick: (e) => {
            return { buttonText: e.component.option("text") };
          },
        },
        {
          text: "Yes, I'm sure",
          stylingMode: "contained",
          type: "danger",
          onClick: (e) => {
            return { buttonText: e.component.option("text") };
          },
        },
      ],
    });
    myDialog.show().then((dialogResult) => {
      console.log(dialogResult.buttonText);
    });
  };
  return (
    <div>
      <div className="m-3">
        <DataGrid
          className={"dx-card wide-card"}
          dataSource={data}
          showBorders={false}
          focusedRowEnabled={true}
          defaultFocusedRowIndex={0}
          columnAutoWidth={true}
          columnHidingEnabled={true}
          keyExpr="Id"
        >
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} showInfo={true} />
          <FilterRow visible={false} />
          <SearchPanel visible={!hideSearch} />
          <Column
            dataField={"OrderId"}
            caption={"Order Number"}
            width={140}
            hidingPriority={2}
            cellRender={(cellData) => {
              // const selectedOrder = data.find(
              //   (item) => item.ProductId === cellData.value
              // );
              return (
                <div
                  className="order-id-decor"
                  onClick={() => {
                    setShowPendingOrderDetailPopup({
                      display: true,
                      data: data,
                      shippingData: shippingAddresses,
                      selectedOrderId: cellData.value,
                    });
                  }}
                >
                  {cellData.value}
                </div>
              );
            }}
          />
          <Column
            dataField={"OrderDate"}
            width={150}
            caption={"Order Date"}
            dataType={"date"}
          />
          <Column dataField={"ShipAddId"} caption={"Shipping Address"}>
            <Lookup
              dataSource={shippingAddressesStore}
              displayExpr="Address"
              valueExpr="ShipId"
            />
          </Column>{" "}
          <Column
            dataField={"Subtotal"}
            caption={"Amount"}
            cellRender={(data, index) => (
              <div>{data.value ? "$" + data.value : "-"} </div>
            )}
          />
          <Column dataField={"Comments"} caption={"Comments"} width={200} />
          <Column
            type="buttons"
            caption={"Action"}
            width={150}
            visible={!hideSearch}
            cellRender={(data) => (
              <div className="flex flex-row">
                <button onClick={onHandleApprove} className="mr-2 approve-btn">
                  Approve
                </button>
                <button onClick={onHandleDeny} className="deny-btn">
                  Deny
                </button>
              </div>
            )}
          ></Column>
          {/* <Toolbar>
            <Item name="exportButton" />
            <Item name="columnChooserButton" />
            <Item location="after" name="searchPanel" />
          </Toolbar> */}
        </DataGrid>
      </div>
      <PendingOrderDetailPopup
        showPendingOrderDetailPopup={showPendingOrderDetailPopup}
        setShowPendingOrderDetailPopup={setShowPendingOrderDetailPopup}
      />
    </div>
  );
};

export default PendingApprovalGrid;
