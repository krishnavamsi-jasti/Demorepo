import { Button, TextBox } from "devextreme-react";
import React from "react";
import "./PageTitleHeader.scss";
import { useNavigate } from "react-router-dom";
import { Item } from "devextreme-react/data-grid";

const PageTitleHeader = ({
  title,
  submitOrder,
  showPendingSearch,
  previousPurchasesSearch,
  submitOrderAction,
  dashboardPage,
  pendingApprovalCount
}) => {
  const navigate = useNavigate();
  return (
    <div className="page-title-header">
      <div className="sub-header-title ">{title}</div>
      {submitOrder ? (
        <div>
          <Button
            text="Submit Order"
            type="default"
            stylingMode="contained"
            icon="plus"
            onClick={submitOrderAction}
          />
        </div>
      ) : null}
      {showPendingSearch ? (
        <div>{/* <TextBox placeholder="Search" height={50} /> */}</div>
      ) : null}
      {previousPurchasesSearch ? (
        <div>{/* <TextBox placeholder="Search" height={50} /> */}</div>
      ) : null}
      {dashboardPage ? (
        <div className="flex flex-row items-center">
          <div className="mr-10">
            <div>
            <span className="pending-text">Pending Approval</span>
              <h5 className="pending-count">{pendingApprovalCount}</h5>
            </div>
          </div>
          <Button
            text="Create New Order"
            type="default"
            stylingMode="contained"
            icon="plus"
            onClick={() => {
              navigate("/create-new-order");
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default PageTitleHeader;
