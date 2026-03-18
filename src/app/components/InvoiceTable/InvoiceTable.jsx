import Dialog from "app/components/Dialog/Dialog";
import MasterTable from "app/components/masterTable/MasterTable";
import { getPageInfo, paymentTypes } from "app/services/SharedData";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { DELETE_INVOICE, GET_INVOICES } from "./Api";

import { Invoice } from "./Invoice";
import InvoiceItems from "./InvoiceItems";
import useAuth from "app/hooks/useAuth";
function InvoiceTable({
  onHiding,
  visible,
  popUp = false,
  onSelectionChanged,
}) {
  const { t, i18n } = useTranslation();
  const [invoice, setInvoice] = useState(null);
  const [values, setValues] = useState({});
  const onToolbarPreparing = (toolbarItems) => {
    toolbarItems.unshift({
      widget: "dxDateBox",
      location: "after",
      options: {
        width: 120,
        placeholder: t("From"),
        displayFormat: "yyyy/MM/dd",
        value: values["From"],
        onValueChanged: (e) => {
          setValues((prev) => ({ ...prev, ["From"]: e.value }));
        },
      },
    });

    // "To" date input
    toolbarItems.unshift({
      widget: "dxDateBox",
      location: "after",
      options: {
        width: 120,
        placeholder: t("To"),
        displayFormat: "yyyy/MM/dd",
        value: values["To"],
        onValueChanged: (e) => {
          setValues((prev) => ({ ...prev, ["To"]: e.value }));
        },
      },
    });
  };

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const print = (e) => {
    setInvoice(e);
    setTimeout(handlePrint, 1000);
  };

  const columnAttributesSupplier = useMemo(() => {
    return [
      {
        caption: "الرقم",
        captionEn: "Id",
        field: "Id",
        widthRatio: 100,
        disable: true,
      },
      {
        caption: "(مرتجع) المصدر",
        captionEn: "Source (Returned)",
        field: "SourceInvoiceId",
        disable: true,
      },
      {
        caption: "تاريخ",
        captionEn: "Date",
        widthRatio: 200,
        type: "date",
        field: "Date",
        disable: true,
      },
      {
        caption: "التكلفة",
        captionEn: "Cost",
        field: "Total",
        disable: true,
      },
      {
        caption: "المدفوع",
        captionEn: "Paid",
        field: "Paid",
        disable: true,
      },
      {
        caption: "الضريبة",
        captionEn: "Tax",
        field: "Tax",
        disable: true,
      },

      {
        caption: "نوع",
        captionEn: "Type",
        field: "Payment",
        widthRatio: 100,
        disable: true,
        display: "Name",
        displayEn: "NameEn",
        data: paymentTypes,
        value: "Id",
      },
      {
        caption: "اسم المستخدم",
        captionEn: "Username",
        field: "UserName",
        disable: true,
      },
      {
        caption: "الي",
        captionEn: "To",
        field: "MemberName",
        disable: true,
      },
      // {
      //   caption: "ملحوظة",
      //   captionEn: "Note",
      //   field: "Note",
      //   disable: true,
      // },
      // {
      //   caption: "",
      //   captionEn: "",
      //   icon: "bulletlist",
      //   field: "Logs",
      //   type: "buttons",
      //   func: (e) => {
      //     setItems(e.Logs);
      //     setVisibleItems(true);
      //   },
      //   widthRatio: 40,
      //   disable: true,
      // },
      {
        caption: "",
        captionEn: "",
        icon: "print",
        widthRatio: 40,
        field: "Logs",
        type: "buttons",
        func: print,
        disable: true,
      },
    ];
  }, []);
  const { lookups } = useAuth();
  const Content = () => (
    <div>
      {/* <InvoiceItems
        visible={visibleItems}
        items={items}
        onHiding={() => setVisibleItems(false)}
      /> */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <Invoice invoice={invoice} />
        </div>
      </div>
      <MasterTable
        apiMethod={GET_INVOICES}
        apiPayload={values}
        apiKey={"Id"}
        colAttributes={columnAttributesSupplier}
        remoteOperations={true}
        onSelectionChanged={onSelectionChanged}
        RowDetails={InvoiceItems}
        onToolbarPreparing={onToolbarPreparing}
        // allowDelete={lookups.Roles.includes(
        //   getPageInfo().key.replace("View", "") + "Delete"
        // )}
        // removeApiMethod={DELETE_INVOICE}
      />
    </div>
  );
  return (
    <div>
      {popUp ? (
        <Dialog
          close={onHiding}
          visible={visible}
          loading={false}
          title={""}
          showTitle={true}
          full
          scrolling={true}
        >
          {" "}
          <div className="container" style={{ paddingTop: 10 }}>
            <Content />
          </div>
        </Dialog>
      ) : (
        <Content />
      )}
    </div>
  );
}

export default InvoiceTable;
