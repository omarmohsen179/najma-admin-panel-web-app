import Dialog from "app/components/Dialog/Dialog";
import MasterTable from "app/components/masterTable/MasterTable";
import useAuth from "app/hooks/useAuth";
import {
  EInvoiceType,
  columnAttributesElements,
} from "app/services/SharedData";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import CrudMUI from "../CrudTable/CrudMUI";
import {
  DELETE_CUSTOMERS,
  DELETE_SUPPLIER,
  EDIT_CUSTOMERS,
  EDIT_SUPPLIER,
  GET_CUSTOMERS,
  GET_SUPPLIERS,
} from "./Api";
function CustomerSupplierTables({
  type = 1,
  onHiding,
  visible,
  popUp = false,
  onSelectionChanged,
}) {
  const { t, i18n } = useTranslation();
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "الرقم",
        captionEn: "Id",
        field: "Id",
        widthRatio: 100,
        disable: true,
      },
      {
        caption: "الاسم",
        field: "MemberName",
        captionEn: "Name",
        required: true,
      },
      {
        caption: "عنوان",
        captionEn: "Address",
        field: "Address",
      },
      {
        caption: "بريد إلكتروني",
        captionEn: "Email",
        field: "Email",
      },
      {
        caption: "رقم التليفون",
        captionEn: "Phone Number",
        field: "PhoneNumber",
      },
      {
        caption: "ملحوظة",
        captionEn: "Note",
        field: "Note",
      },
    ];
  }, []);

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
        caption: "الاسم",
        field: "MemberName",
        captionEn: "Name",
        required: true,
      },
      {
        caption: "عنوان",
        captionEn: "Address",
        field: "Address",
      },
      {
        caption: "بريد إلكتروني",
        captionEn: "Email",
        field: "Email",
      },
      {
        caption: "رقم التليفون",
        captionEn: "Phone Number",
        field: "PhoneNumber",
      },
      {
        caption: "ملحوظة",
        captionEn: "Note",
        field: "Note",
      },
    ];
  }, []);
  const Content = () => (
    <div>
      {EInvoiceType?.find((e) => e["Id"] == type)?.NameEn == "Customer" ? (
        <CrudMUI
          id={"Id"}
          colAttributes={columnAttributes}
          EDIT={EDIT_CUSTOMERS}
          ADD={EDIT_CUSTOMERS}
          DELETE={DELETE_CUSTOMERS}
          GET={GET_CUSTOMERS}
          onSelectionChanged={onSelectionChanged}
        />
      ) : (
        <CrudMUI
          id={"Id"}
          colAttributes={columnAttributesSupplier}
          EDIT={EDIT_SUPPLIER}
          ADD={EDIT_SUPPLIER}
          DELETE={DELETE_SUPPLIER}
          GET={GET_SUPPLIERS}
          onSelectionChanged={onSelectionChanged}
        />
      )}
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
          <Content />
        </Dialog>
      ) : (
        <Content />
      )}
    </div>
  );
}

export default CustomerSupplierTables;
