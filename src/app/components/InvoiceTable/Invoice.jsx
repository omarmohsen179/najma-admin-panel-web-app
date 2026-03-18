import useAuth from "app/hooks/useAuth";
import { itemFormat, paymentTypes } from "app/services/SharedData";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { encodeInvoiceToQR } from "./QR";
import "./Invoice.css";

export const Invoice = React.forwardRef(({ invoice }) => {
  const { t, i18n } = useTranslation();

  const lookups = useAuth().lookups;

  const [storeInfo, setStoreInfo] = useState(null);
  useEffect(() => {
    setStoreInfo(lookups.UsersStores[0]);
  }, [lookups, invoice]);
  return invoice != null && storeInfo != null ? (
    <body style={{ width: "360px", margin: 20 }} className="invoice_body">
      <header style={{ width: "360px" }}>
        <div id="logo" class="media">
          {/* <img src="logo.png" style="width: 150px;align-content: center;" /> */}
        </div>
        <p align="center">{storeInfo.StoreName}</p>
        <p align="center">
          TAX Number : {storeInfo.TaxNumber}
          <br />
          {storeInfo.BranchName}, {storeInfo.Street},{storeInfo.City}
          {storeInfo.PhoneNumber}.
        </p>
      </header>
      <table style={{ maxWidth: "360px" }} class="bill-details">
        <tbody style={{ maxWidth: "360px" }} align="center">
          <tr>
            <td>
              Date :<span> Sat Jan 08 2022 | 17:09:44</span>
            </td>
            <td>
              Invoice ID :<span>{invoice?.Id}</span>
            </td>
          </tr>
          <tr></tr>
          <tr>
            <th class="center-align" colspan="2">
              <span class="receipt">Order Number: {invoice?.Id} </span>
            </th>
          </tr>
        </tbody>
      </table>
      <table class="items" style={{ maxWidth: "360px" }}>
        <thead>
          <tr>
            <th class="heading name">Item الصنف</th>
            <th class="heading Itemprice">Price السعر</th>
            <th class="heading qty">Qty الكمية</th>
            <th class="heading ItemTotal">Sub اجمالي</th>
          </tr>
        </thead>

        <tbody style={{ maxWidth: "360px" }}>
          <tr>
            <td>{"Item Name"}</td>

            <td class="price">{"Price"}</td>
            <td>{"Qty"}</td>
            <td class="price">{"Total Price (Qty*Price)"}</td>
          </tr>
          {invoice?.Logs?.map((cartProduct, key) => (
            <tr>
              <td>{itemFormat(lookups, cartProduct)}</td>
              <td class="price">{cartProduct.SellPrice.toFixed(2)}</td>
              <td>{cartProduct.CurrentQuantity}</td>
              <td class="price">
                {(cartProduct.SellPrice * cartProduct.CurrentQuantity).toFixed(
                  2
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colspan="3" class="sum-up line">
              Total Before Tax الاجمالي قبل الضريبة
            </td>
            <td class="line price" align="left">
              {invoice.Total?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td colspan="3" class="sum-up">
              TAX الضريبة
            </td>
            <td class="price" align="left">
              {(invoice.Total * invoice.Tax).toFixed(2)}
            </td>
          </tr>
          <tr></tr>
          <tr>
            <th colspan="3" class="total text">
              Grand Total الاجمالي
            </th>
            <th class="total price" align="left">
              {(invoice.Total + invoice.Total * invoice.Tax).toFixed(2)}
            </th>
          </tr>
          <tr>
            <td colspan="3" class="sum-up">
              Paid المدفوع
            </td>
            <td class="price" align="left">
              {invoice?.PaymentLogs.map((e) => e.Payment)
                .reduce((partialSum, a) => partialSum + a, 0)
                .toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      <section
        style={{ width: "360px", alignContent: "center" }}
        align="center"
      >
        <p>
          Payment Method:
          <span>
            {" " +
              invoice?.PaymentLogs?.filter(
                (
                  (seenKeys) => (item) =>
                    !seenKeys.has(item.Type) && seenKeys.add(item.Type)
                )(new Set())
              )?.map(
                (e) => paymentTypes.find((ex) => ex.Id == e.Type)?.NameEn
              ) +
              " , "}
          </span>
        </p>{" "}
        {invoice.MemberName ? (
          <p>
            To: <span>{invoice.MemberName}</span>
          </p>
        ) : null}
        <p>
          Cashier UserName: <span>{invoice.UserName}</span>
        </p>
        <QRCodeCanvas
          size={200}
          value={encodeInvoiceToQR(
            storeInfo.StoreName,
            storeInfo.TaxNumber,
            invoice.Date,
            invoice.Total?.toFixed(2),
            (invoice.Total * invoice.Tax).toFixed(2)
          )}
        />
        <p style={{ textAlign: "center" }}>Thank you for your visit!</p>
        <p style={{ textAlign: "center" }}>
          <a href="/"> {storeInfo.Website} </a>
        </p>
      </section>
    </body>
  ) : null;
});
