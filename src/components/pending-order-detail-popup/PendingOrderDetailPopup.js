import React from "react";
import "./PendingOrderDetailPopup.scss";
import { Button, Popup } from "devextreme-react";
import DataGrid, {
  Column,
  FilterRow,
  Pager,
  Paging,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";

const PendingOrderDetailPopup = React.memo(
  ({ showPendingOrderDetailPopup, setShowPendingOrderDetailPopup }) => {
    const orderData = showPendingOrderDetailPopup?.data;
    const addressData = showPendingOrderDetailPopup?.shippingData;
    console.log(orderData);
    const selectedOrder = orderData?.find(
      (item) => item.OrderId === showPendingOrderDetailPopup?.selectedOrderId
    );

    const selectedShippingAddress = addressData?.find(item => item.ShipId === selectedOrder.ShipAddId);
    console.log(selectedShippingAddress);
    const renderContent = () => {
      return (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex flex-row justify-center">
                <div className="text-base">
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Client Name:</div>
                    <div>{selectedOrder?.CustomerName}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Client PO Number:</div>
                    <div>{selectedOrder?.ClientPoNum}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Order Date:</div>
                    <div>{selectedOrder?.OrderDate}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Contact Name:</div>
                    <div>{selectedOrder?.PersonPlacedOrder}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Budget Code: :</div>
                    <div>{selectedOrder?.BudgetCode}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <div className="text-base">
                <div className="row flex flex-wrap p-2">
                  <div className="mr-5 font-bold">Billing Address:</div>
                  <div>{selectedOrder?.OrderId}</div>
                </div>
                <div className="row flex flex-wrap p-2">
                  <div className="mr-5 font-bold">Ship To:</div>
                  <div>
                  <p>{selectedShippingAddress?.Address}</p>
                  <p>{selectedShippingAddress?.City}</p>
                  <p>{selectedShippingAddress?.StateName}, {selectedShippingAddress?.CountryName}</p>
                  <p>{selectedShippingAddress?.ZipCode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pr-[20px] mt-[10px]">
            <Button
              text="Print"
              type="normal"
              stylingMode="contained"
              icon="print"
              onClick={() => window.print()}
            />
            <Button
              text="Modify"
              type="default"
              stylingMode="contained"
              className="ml-[10px] mr-[10px]"
              icon="edit"
              // onClick={() => setShowAdvancedSearch(true)}
            />
            <Button
              text="Close"
              type="danger"
              stylingMode="contained"
              icon="close"
              onClick={() =>
                setShowPendingOrderDetailPopup({ display: false, data: null })
              }
            />
          </div>
          <div className="pending-order-grid mt-6">
            <DataGrid
              className={"dx-card wide-card"}
              dataSource={selectedOrder?.OrderLines}
              showBorders={false}
              focusedRowEnabled={true}
              defaultFocusedRowIndex={0}
              columnAutoWidth={true}
              columnHidingEnabled={true}
            >
              <Selection mode="single" />
              <Paging defaultPageSize={10} />
              <Pager showPageSizeSelector={true} showInfo={true} />
              <FilterRow visible={false} />
              <SearchPanel visible={false}
            width={240}
            placeholder="Search..." />
              <Column
                dataField={"BarCode"}
                caption={"Product Number"}
                width={140}
                hidingPriority={2}
              />
              <Column
                dataField={"ProductDesc"}
                caption={"Description"}
                hidingPriority={2}
              />
              <Column dataField={"OrdQty"} width={150} caption={"Ordered"} />
              <Column dataField={"UnitPrice"} caption={"Unit Price"} />
              <Column
                dataField={"Subtotal"}
                caption={"Total"}
                calculateCellValue={(rowData) => rowData.OrdQty * rowData.UnitPrice}
              />
              <Column dataField={"Comments"} caption={"Comments"} />
            </DataGrid>
          </div>
        </div>
      );
    };
    return (
      <Popup
        showTitle={true}
        id="pending-order-elem"
        title={"Order #:" + showPendingOrderDetailPopup?.selectedOrderId}
        visible={showPendingOrderDetailPopup?.display}
        onHiding={() =>
          setShowPendingOrderDetailPopup({ display: false, data: null })
        }
        //   width={1200}
        height={"auto"}
        maxHeight={600}
        contentRender={renderContent}
      />
    );
  }
);

export default PendingOrderDetailPopup;
