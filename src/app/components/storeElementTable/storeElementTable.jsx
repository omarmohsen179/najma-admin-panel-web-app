import React, { useCallback, useEffect, useRef, useState } from "react";

import useAuth from "app/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { columnAttributesElements } from "../../services/SharedData";
import CrudMUI from "../CrudTable/CrudMUI";
import {
  ADD_STORE_ELEMENTS,
  DELETE_STORE_ELEMENTS,
  EDIT_STORE_ELEMENTS,
  GET_STORE_ELEMENTS_ELEMENTS_ALL,
  GET_STORE_ELEMENTS_NEEDS_ELEMENTS_ALL,
} from "./Api";
const StoreElementTable = ({
  addColumns = [],
  view = false,
  needs = false,
}) => {
  const { t, i18n } = useTranslation();

  const lookups = useAuth().lookups;
  const isViewOnly = useCallback(() => {
    return (
      !lookups?.Roles?.includes("StoreElementsUpdate") &&
      !lookups?.Roles?.includes("StoreElementsDelete")
    );
    // return true;
  }, [lookups?.Roles]);
  const [values, setValues] = useState({});
  const handleChange = useCallback((e) => {
    console.log(e);
    // setValues((prev) => ({ ...prev, [name]: value }));
  }, []);
  const [col, setCol] = useState([]);
  const onEditorPreparing = (e) => {
    if (e.parentType === "dataRow" && e.dataField === "ElementId") {
      const isStateNotSet = e.row.data.CategoryId === undefined;
      e.editorOptions.disabled = isStateNotSet;
    }
  };

  useEffect(() => {
    const cisCols =
      lookups != null
        ? [
            ...columnAttributesElements(lookups, i18n),
            {
              caption: "كمية",
              field: "Quantity",
              captionEn: "Quantity",
            },

            {
              caption: "القيمة",
              field: "Cost",
              captionEn: "Cost",
            },
            {
              caption: "سعر البيع",
              field: "SellPrice",
              captionEn: "Sell price",
            },
            ...addColumns,
          ]
        : [];
    setCol(
      lookups != null &&
        lookups?.Roles?.find((role) => role == "StoreElementsCost")
        ? cisCols
        : cisCols.filter((e) => !["Cost", "TotalCost"].includes(e.field))
    );
  }, [lookups]);
  // const summaries = [
  //   {
  //     column: "Cost",
  //     summaryType: "count",
  //     valueFormat: "currency",
  //     cssClass: "summaryNetSum",
  //     showInColumn: "Cost",
  //     customizeText: (res) => {
  //       return (
  //         // t("Total Cost") +
  //         ` ${data
  //           .map((e) => e?.TotalCost)
  //           .reduce((partialSum, a) => partialSum + a, 0)
  //           .toFixed(2)} `
  //       );
  //     },
  //   },
  //   {
  //     column: "CurrentQuantity",
  //     summaryType: "count",
  //     valueFormat: "currency",
  //     cssClass: "summaryNetSum",
  //     showInColumn: "CurrentQuantity",
  //     customizeText: (res) => {
  //       return (
  //         // t("Total Quantity") +
  //         `
  //                  ${data
  //                    .map((e) => e?.Quantity)
  //                    .reduce((partialSum, a) => partialSum + a, 0)
  //                    .toFixed(2)} `
  //       );
  //     },
  //   },
  // ];
  const onToolbarPreparing = (toolbarItems) => {
    toolbarItems.unshift({
      widget: "dxSelectBox",
      location: "after",
      options: {
        dataSource: [
          {
            Id: 0,
            CategoryName: i18n.language == "en" ? "All" : "كل",
          },
          ...lookups.Categories,
        ],
        placeholder: t("Category"),
        displayExpr: "CategoryName",
        valueExpr: "Id",
        name: "Category",
        value: values["CategoryId"],
        onValueChanged: (e) => {
          setValues((prev) => ({ ...prev, ["CategoryId"]: e.value }));
        },
      },
    });

    // Sub-Category SelectBox
    toolbarItems.unshift({
      widget: "dxSelectBox",
      location: "after",
      options: {
        dataSource: [
          {
            Id: 0,
            ElementName: i18n.language == "en" ? "All" : "كل",
          },
          ...lookups.Items,
        ],
        placeholder: t("Sub-Category"),
        displayExpr: "ElementName",
        valueExpr: "Id",
        name: "Item",
        value: values["ElementId"],
        onValueChanged: (e) => {
          setValues((prev) => ({ ...prev, ["ElementId"]: e.value }));
        },
      },
    });

    // Year NumberBox
    toolbarItems.unshift({
      widget: "dxNumberBox",
      location: "after",
      options: {
        // min: 0,

        step: 1,
        placeholder: t("Year"),
        showSpinButtons: true,
        name: "SeasonYear",
        value: values["SeasonYear"],
        onValueChanged: (e) => {
          setValues((prev) => ({ ...prev, ["SeasonYear"]: e.value }));
        },
      },
    });
  };

  return (
    <>
      <CrudMUI
        id={"Id"}
        colAttributes={col}
        GET={
          needs
            ? GET_STORE_ELEMENTS_NEEDS_ELEMENTS_ALL
            : GET_STORE_ELEMENTS_ELEMENTS_ALL
        }
        ADD={ADD_STORE_ELEMENTS}
        EDIT={EDIT_STORE_ELEMENTS}
        DELETE={DELETE_STORE_ELEMENTS}
        onEditorPreparing={onEditorPreparing}
        // summaries={summaries}
        view={view}
        editMode="popup"
        apiPayload={values}
        onToolbarPreparing={onToolbarPreparing}
      />
    </>
  );
};

export default React.memo(StoreElementTable);
