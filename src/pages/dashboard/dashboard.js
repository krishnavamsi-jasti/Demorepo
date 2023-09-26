import React, { useEffect, useState } from "react";
import "./dashboard.scss";
import {
  PageTitleHeader,
  PendingApprovalGrid,
  PrevPurchasesGrid,
  RecentOrdersTabGrid,
} from "../../components";
import Tabs, { Item } from "devextreme-react/tabs";
import api from "../../utils/api";
import { useAuth } from "../../contexts/auth";

const Dashboard = () => {
  const { user } = useAuth();
  const [pendingApprovalCount, setPendingApprovalCount] = useState("-");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const statuses = [{ OrderStatusId: 33, description: "Review Required" }];
  const renderTitle = (title) => {
    return <div className="tab-title">{title}</div>;
  };

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
      OrdersStatus: [33],
      TransactionId: null,
      From: null,
      To: null,
      ClientSearchText: null,
      ProductSearchText: null,
      ClientId: user.ClientId,
      CashierId: null,
      ProductId: null,
      PageSize: 10000,
      Page: 1,
      SiteId: 100,
      TerminalId: null,
    };
    fetch(api.url + "Orders/GetOrdersToApproveCountAsync", {
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
        setPendingApprovalCount(data);
      })
      .catch((error) => console.log(error));
  }, []);

  const onTabsSelectionChanged = (args) => {
    if (args.name === "selectedIndex") {
      setSelectedIndex(args.value);
    }
  };

  return (
    <div>
      <PageTitleHeader title="Dashboard" />
      <PageTitleHeader
        dashboardPage={true}
        pendingApprovalCount={pendingApprovalCount}
      />
      <div className="bg-white	">
        <Tabs
          width={600}
          selectedIndex={selectedIndex}
          onOptionChanged={onTabsSelectionChanged}
        >
          <Item render={renderTitle.bind(this, "Recent Orders")}></Item>
          <Item render={renderTitle.bind(this, "Pending Approval")}></Item>
          <Item render={renderTitle.bind(this, "Previous Orders")}></Item>
        </Tabs>

        {selectedIndex === 0 ? (
          <RecentOrdersTabGrid statuses={statuses} />
        ) : null}
        {selectedIndex === 1 ? (
          <PendingApprovalGrid hideSearch={true} pageSize={5} />
        ) : null}
        {selectedIndex === 2 ? (
          <PrevPurchasesGrid hideSearch={true} pageSize={5} />
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
