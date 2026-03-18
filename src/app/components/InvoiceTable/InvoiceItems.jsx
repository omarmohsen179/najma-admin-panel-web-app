import MasterTable from "app/components/masterTable/MasterTable";
import useAuth from "app/hooks/useAuth";
import { DELETE_PAYMENT } from "app/pages/Payments/Api";
import {
  columnAttributesElements,
  columnPayments,
  getPageInfo,
} from "app/services/SharedData";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
function InvoiceItems(props) {
  const { data } = props;
  console.log(data.data.Logs);
  const { t, i18n } = useTranslation();
  const lookups = useAuth().lookups;
  const cols = useMemo(
    () => [
      ...columnAttributesElements(lookups, i18n),
      {
        caption: "Quantity",
        field: "Quantity",
        captionEn: "Quantity",
      },
    ],
    [lookups, i18n]
  );

  return (
    <div style={{ backgroundColor: "#d1d1d1", padding: "10px 0" }}>
      {/* <Dialog
        close={onHiding}
        visible={visible}
        loading={false}
        title={"Items"}
        showTitle={true}
        full
        scrolling={true}
      > */}
      <div className="container">
        <MasterTable
          dataSource={data.data.Logs?.map((ex) => {
            ex.CategoryId = lookups.Items.find(
              (e) => e.Id == ex.ElementId
            ).CategoryId;
            return ex;
          })}
          height=""
          colAttributes={cols}
        />
        <h4>{t("Payments")}</h4>

        <MasterTable
          dataSource={data.data.PaymentLogs}
          height=""
          colAttributes={columnPayments}
          // allowDelete={lookups.Roles.includes(
          //   getPageInfo().key.replace("View", "") + "Delete"
          // )}
          // onRowRemoving={(e) => {
          //   e.cancel = true;
          //   DELETE_PAYMENT(e.data.Id).then(() => {});
          // }}
        />
      </div>
      {/* </Dialog> */}
    </div>
  );
}

export default InvoiceItems;
