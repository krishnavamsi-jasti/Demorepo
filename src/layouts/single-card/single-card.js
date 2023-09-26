import React from "react";
import ScrollView from "devextreme-react/scroll-view";
import "./single-card.scss";

export default function SingleCard({ title, description, children }) {
  return title !== "Sign In" ? (
    <ScrollView
      height={"100%"}
      width={"100%"}
      className={"with-footer single-card"}
    >
      <div className={"dx-card content"}>
        <div className={"header"}>
          <div className={"title"}>{title}</div>
          <div className={"description"}>{description}</div>
        </div>
        {children}
      </div>
    </ScrollView>
  ) : (
    <ScrollView
      height={"100%"}
      width={"100%"}
      className={"with-footer single-card login-page "}
    >
      <div className={"dx-card content"}>
        <div className={"header"}>
          <div className={"title"}>{title}</div>
          <div className={"description"}>{description}</div>
        </div>
        {children}
      </div>
    </ScrollView>
  );
}
