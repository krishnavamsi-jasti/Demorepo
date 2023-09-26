import React, { useState } from "react";
import "./NewOrderPopup.scss";
import { Button, CheckBox, Popup, SelectBox, TextArea, TextBox } from "devextreme-react";

const NewOrderPopup = ({showPopup, setShowPopup}) => {
//   const [showPopup, setShowPopup] = useState(false);
  const renderContent = () => {
    return (
      <>
        {/* <div className="text-center	font-bold text-lg">New Shipping Address</div> */}
        <div className="form">
          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-label">Company Name:</div>
              <div className="dx-field-value">
                <TextBox placeholder="Enter Company Name" />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">City:</div>
              <div className="dx-field-value">
                <TextBox placeholder="Enter City" />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Address:</div>
              <div className="dx-field-value">
                <TextArea placeholder="Enter Address" />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Country:</div>
              <div className="dx-field-value">
              <SelectBox
                displayExpr="Name"
                dataSource={['USA', 'Canada']}
                // inputAttr={companyLabel}
                // labelMode={companySelectorLabelMode}
                label='Select company'
                value={'USA'}
                // onValueChanged={this.onCompanyChanged}
              />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">State:</div>
              <div className="dx-field-value">
                <SelectBox
                  displayExpr="Name"
                  dataSource={['Ontario', 'Vancover']}
                  // inputAttr={companyLabel}
                  // labelMode={companySelectorLabelMode}
                  label='Select company'
                  value={'Ontario'}
                  // onValueChanged={this.onCompanyChanged}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Zip Code:</div>
              <div className="dx-field-value">
                <TextBox placeholder="Enter Zip Code" />
              </div>
            </div>
            <CheckBox
              text="readOnly"
              value={false}
              // onValueChanged={onReadOnlyChanged}
            />
          </div>
          <div className="flex justify-end">
            <Button
              width={120}
              className="m-2"
              text="Save"
              type="default"
              stylingMode="contained"
            />
            <Button
              width={120}
              className="m-2"
              text="Cancel"
              onClick={() => setShowPopup(false)}
              type="danger"
              stylingMode="contained"
            />
          </div>
        </div>
      </>
    );
  };
  return (
    <Popup
      showTitle={true}
      title="New Shipping Address"
      visible={showPopup}
      width={500}
      // height={500}
      contentRender={renderContent}
    />
  );
};

export default NewOrderPopup;
