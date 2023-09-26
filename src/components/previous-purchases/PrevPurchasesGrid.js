import React, { useEffect, useState } from "react";
import "./PrevPurchases.scss";
import "devextreme/data/odata/store";
import api from "../../utils/api";
import { useAuth } from "../../contexts/auth";
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  LoadPanel,
  SearchPanel,
} from "devextreme-react/data-grid";
import PendingOrderDetailPopup from "../pending-order-detail-popup/PendingOrderDetailPopup";
import PreviousPurchasesPopup from "../previous-purchases-popup/PreviousPurchasesPopup";

const PrevPurchasesGrid = ({hideSearch, pageSize = 10}) => {
  const { user } = useAuth();
  const [shippingAddresses, setShippingAddresses] = useState([]);

  const [showPreviousPurchasesPopup, setShowPreviousPurchasesPopup] = useState({
    display: false,
    data: [],
    selectedOrderId: null,
  });

  let reqObj = {
    Type: null,
    RequestType: 0,
    SaleId: null,
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
    fetch(api.url + "Sales/GetSalesAsync", {
      method: "POST",
      body: JSON.stringify(reqObj),
      // body: JSON.stringify({
      //   "ClientId": '407',
      //   "OrdersStatus": [33]
      // }),
      headers: {
        APP_KEY: user.appKey,
        "ZUMO-API-VERSION": "2.0.0",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setData(JSON.parse(data.JsonData)))
      .catch((error) => console.log(error));
  }, []);
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
        >
          {/* <LoadPanel
                height={100}
                width={250}
                indicatorSrc="https://js.devexpress.com/Content/data/loadingIcons/rolling.svg"
            /> */}
          <Paging defaultPageSize={10} />
          <Pager showPageSizeSelector={true} showInfo={true} />
          <FilterRow visible={false} />
          <SearchPanel visible={!hideSearch} />

          <Column
            dataField={"InvoiceId"}
            caption={"Invoice #"}
            width={90}
            hidingPriority={2}
            cellRender={(cellData) => {
              // const selectedOrder = data.find(
              //   (item) => item.ProductId === cellData.value
              // );
              return (
                <div
                  className="order-id-decor"
                  onClick={() => {
                    setShowPreviousPurchasesPopup({
                      display: true,
                      data: data,
                      shippingData: shippingAddresses,
                      selectedInvoiceId: cellData.value,
                    });
                  }}
                >
                  {cellData.value}
                </div>
              );
            }}
          />
          <Column
            dataField={"InvoiceDate"}
            caption={"Invoice Date"}
            dataType={"date"}
            hidingPriority={6}
          />
          <Column
            dataField={"CustomerName"}
            caption={"Ship To"}
            hidingPriority={3}
          />
          <Column
            dataField={"Subtotal"}
            caption={"Amount"}
            // allowSorting={false}
            hidingPriority={7}
            cellRender={(data) => (
              <div>{"$" + data.value} </div>
              // <div>{data.value ? "$" + data.value : "-"} </div>
            )}
          />
          <Column
            dataField={"Comments"}
            caption={"Comments"}
            width={150}
            // dataType={"date"}
            hidingPriority={3}
          />
        </DataGrid>
      </div>
      <PreviousPurchasesPopup
        showPreviousPurchasesPopup={showPreviousPurchasesPopup}
        setShowPreviousPurchasesPopup={setShowPreviousPurchasesPopup}
      />
    </div>
  );
};

export default PrevPurchasesGrid;
