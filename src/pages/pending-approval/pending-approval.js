import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { PageTitleHeader, PendingApprovalGrid } from "../../components";

const PendingApproval = () => {
  const { user } = useAuth();

  let clientId = user.ClientId | "407";
  let appKey = "126B7E01-AFCB-4065-BEE4-04A600BDA899";

  useEffect(() => {}, []);

  return (
    <>
      <PageTitleHeader
        title="Pending Approval Orders"
        showPendingSearch={true}
      />
      {/* <h1>This is Pending from Approval Page</h1> */}
      <PendingApprovalGrid />
    </>
  );
};

export default PendingApproval;
