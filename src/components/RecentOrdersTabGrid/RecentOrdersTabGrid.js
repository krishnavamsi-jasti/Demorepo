import React, { useEffect, useState } from "react";
import "./RecentOrdersTabGrid.scss";
import { DataGrid } from "devextreme-react";
import {
  Column,
  FilterRow,
  Lookup,
  Pager,
  Paging,
} from "devextreme-react/data-grid";
import api from "../../utils/api";
import { useAuth } from "../../contexts/auth";
import CustomStore from "devextreme/data/custom_store";
import PendingOrderDetailPopup from "../pending-order-detail-popup/PendingOrderDetailPopup";

const RecentOrdersTabGrid = ({ statuses }) => {
  const { user } = useAuth();
  const [recentOrdersData, setRecentOrdersData] = useState([]);
  const [shippingAddresses, setShippingAddresses] = useState([]);
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
    const reqObj = {
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
      OrdersStatus: [],
      TransactionId: null,
      From: null,
      To: null,
      ClientSearchText: null,
      ProductSearchText: null,
      ClientId: user.ClientId,
      CashierId: null,
      ProductId: null,
      PageSize: 5,
      Page: 1,
      SiteId: 100,
      TerminalId: null,
    };
    fetch(api.url + "Orders/GetOrdersAsync", {
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
        setRecentOrdersData(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <DataGrid
        className={"dx-card wide-card"}
        dataSource={recentOrdersData}
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
        <Column
          dataField={"OrderId"}
          caption={"Order Number"}
          width={150}
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
                    data: recentOrdersData,
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
          caption={"Order Date"}
          width={200}
          hidingPriority={2}
          dataType="date"
        />
        <Column dataField={"ShipAddId"} caption={"Shipping Address"}>
          <Lookup
            dataSource={shippingAddressesStore}
            displayExpr="Address"
            valueExpr="ShipId"
          />
        </Column>
        <Column dataField={"Total"} caption={"Amount"} />
        <Column dataField={"OrderStatusId"} caption={"Status"}>
          <Lookup
            dataSource={statuses}
            displayExpr="description"
            valueExpr="OrderStatusId"
          />
        </Column>
      </DataGrid>
      <PendingOrderDetailPopup
        showPendingOrderDetailPopup={showPendingOrderDetailPopup}
        setShowPendingOrderDetailPopup={setShowPendingOrderDetailPopup}
      />
    </div>
  );
};

export default RecentOrdersTabGrid;
