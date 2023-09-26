import React, { useEffect, useState } from "react";
import { PageTitleHeader, PrevPurchasesGrid } from "../../components";

const PendingApproval = () => {
  return (
    <>
      <PageTitleHeader title="Previous Orders" previousPurchasesSearch={true}/>
      {/* <h1>This is PreviousPurchases from Approval Page</h1> */}
      <PrevPurchasesGrid />
    </>
  );
};

export default PendingApproval;
