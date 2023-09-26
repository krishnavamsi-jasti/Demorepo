import React, { useEffect } from "react";
import "./ProductDetailPopup.scss";
import { Button, Popup } from "devextreme-react";
import api from "../../utils/api";
import { useAuth } from "../../contexts/auth";

const ProductDetailPopup = React.memo(
  ({ showProductDetailPopup, setShowProductDetailPopup }) => {
    const { user } = useAuth();
    const productList = showProductDetailPopup?.data;
    const productData = productList?.find(
      (item) => item.ProductId === showProductDetailPopup.selectedProductId
    );

    useEffect(() => {
      fetch(
        api.url +
          "Attachment/GetByDocumentAsync?documenttype=product&documentid=" +
          productData?.ProductId,
        {
          method: "GET",
          headers: {
            APP_KEY: user.appKey,
            "ZUMO-API-VERSION": "2.0.0",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log(error));
    }, []);

    const renderContent = () => {
      return (
        <div>
          <div className="flex flex-row justify-center justify-around">
            <div className="image-container">
              <img src="https://i.imgur.com/wrt6eEK.png" alt="" />
              {/* <img src={"http://bmcloudtest.atlantissolution.com/temp/springisdprod/"+ productData?.ProductId + '/' + '/'} alt="" /> */}
            </div>
            <div className="text-base">
              <div className="rown flex flex-wrap bottom-border">
                <div className="mr-5 font-bold">Product Name:</div>
                <div>{productData?.Description}</div>
              </div>
              <div className="rown flex flex-wrap bottom-border">
                <div className="mr-5 font-bold">Price:</div>
                <div>{productData?.PricePer}</div>
              </div>
              <div className="rown flex flex-wrap bottom-border">
                <div className="mr-5 font-bold">Product ID:</div>
                <div>{productData?.ProductNum}</div>
              </div>
              <div className="rown flex flex-wrap bottom-border">
                <div className="mr-5 font-bold">Category:</div>
                <div>{productData?.Category}</div>
              </div>
              <div className="rown flex flex-wrap bottom-border">
                <div className="mr-5 font-bold">Class:</div>
                <div>{productData?.Class}</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="m-2"
              text="Cancel"
              onClick={() =>
                setShowProductDetailPopup({ display: false, data: null })
              }
              type="danger"
              stylingMode="contained"
            />
          </div>
        </div>
      );
    };
    return (
      <Popup
        showTitle={true}
        title={"Product Information"}
        visible={showProductDetailPopup?.display}
        onHiding={() =>
          setShowProductDetailPopup({ display: false, data: null })
        }
        //   width={1200}
        height={400}
        contentRender={renderContent}
      />
    );
  }
);

export default ProductDetailPopup;
