import React from "react";
import "./PreviousPurchasesPopup.scss";
import { Button, Popup } from "devextreme-react";
import DataGrid, {
  Column,
  FilterRow,
  Pager,
  Paging,
  SearchPanel,
  Selection,
} from "devextreme-react/data-grid";

export const PreviousPurchasesPopup = React.memo(
  ({ showPreviousPurchasesPopup, setShowPreviousPurchasesPopup }) => {
    const invoiceData = showPreviousPurchasesPopup?.data;
    const addressData = showPreviousPurchasesPopup?.shippingData;
    console.log(invoiceData);
    const selectedInvoice = invoiceData?.find(
      (item) => item.InvoiceId === showPreviousPurchasesPopup?.selectedInvoiceId
    );
    const selectedShippingAddress = addressData?.find(item => item.ShipId === selectedInvoice.ShipAddId);
    const renderContent = () => {
      return (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex flex-row justify-center">
                <div className="text-base">
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Client Name:</div>
                    <div>{selectedInvoice?.CustomerName}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Client PO Number:</div>
                    <div>{selectedInvoice?.ClientPoNum}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Order Date:</div>
                    <div>{selectedInvoice?.OrderDate}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Contact Name:</div>
                    <div>{selectedInvoice?.PersonPlacedOrder}</div>
                  </div>
                  <div className="row flex flex-wrap p-2">
                    <div className="mr-5 font-bold">Budget Code: :</div>
                    <div>{selectedInvoice?.BudgetCode}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center">
              <div className="text-base">
                <div className="row flex flex-wrap p-2">
                  <div className="mr-5 font-bold">Billing Address:</div>
                  <div>{selectedInvoice?.OrderId}</div>
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
              text="Copy Order"
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
                setShowPreviousPurchasesPopup({ display: false, data: null })
              }
            />
          </div>
          <div className="pending-order-grid mt-6">
            <DataGrid
              className={"dx-card wide-card"}
              dataSource={selectedInvoice?.InvoiceDetails}
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
              <SearchPanel
                visible={false}
                width={240}
                placeholder="Search..."
              />
              <Column
                dataField={"ProductNumber"}
                caption={"Product Number"}
                width={140}
                hidingPriority={2}
              />
              <Column
                dataField={"ProductDesc"}
                caption={"Description"}
                hidingPriority={2}
              />
              <Column dataField={"OrderQty"} width={150} caption={"Ordered"} />
              <Column dataField={"ShipQty"} width={150} caption={"Shipped"} />
              <Column dataField={"AccountCode"} width={150} caption={"Account Code"} />
              <Column dataField={"UnitPrice"} caption={"Unit Price"} />
              <Column
                dataField={"Subtotal"}
                caption={"Total"}
                calculateCellValue={(rowData) =>
                    Math.round((rowData.OrderQty * rowData.UnitPrice + Number.EPSILON) * 100) / 100
                }
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
        title={"Invoice #:" + showPreviousPurchasesPopup?.selectedInvoiceId}
        visible={showPreviousPurchasesPopup?.display}
        onHiding={() =>
          setShowPreviousPurchasesPopup({ display: false, data: null })
        }
        //   width={1200}
        height={"auto"}
        maxHeight={600}
        contentRender={renderContent}
      />
    );
  }
);

export default PreviousPurchasesPopup;
