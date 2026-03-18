import { useMemo } from "react";

import notify from "devextreme/ui/notify";
import { useTranslation } from "react-i18next";
import InputTableEdit from "./masterTable/InputTableEdit";

const ItemStoreTable = ({
  columns,
  setvalues,
  values,
  addApi,

  keyObj = "ElementId",
  deleteApi,
  ListName = "ItemsStores",
}) => {
  const { t, i18n } = useTranslation();

  let onRowRemoving = (e) => {};
  const onRowInserting = (item) => {
    if (
      !values[ListName].find((e) => e.ElementId === item.data.ElementId) &&
      item.data.Quantity >= 0
    ) {
      addApi()
        .then((e) => {
          setvalues((prev) => {
            return {
              ...prev,
              [ListName]: [
                { Id: 0 - prev[ListName].length, ...item.data },
                ...prev[ListName],
              ],
            };
          });
        })
        .catch((e) => {});
    } else {
      item.cancel = true;
      notify(
        {
          message: t("this item already in this category"),
          width: 600,
        },
        "error",
        3000
      );
    }
  };
  const onRowUpdating = (item) => {
    if (
      !values[ListName].find((e) => e[keyObj] === item.newData[keyObj]) &&
      item.newData.Quantity >= 0
    )
      setvalues((prev) => {
        return {
          ...prev,
          [ListName]: prev[ListName].map((e) =>
            e.Id === item.key.Id ? { ...e, ...item.newData } : { ...e }
          ),
        };
      });
    else {
      item.cancel = true;
      notify(
        {
          message: t("this item already in this category"),
          width: 600,
        },
        "error",
        3000
      );
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      <h3>{t("Stores")}</h3>
      <InputTableEdit
        Uicon
        height="500px"
        dataSource={values[ListName]}
        colAttributes={columns}
        onRowInserting={onRowInserting}
        onRowUpdating={onRowUpdating}
        canDelete={false}
        canUpdate={false}
        canAdd={false}
        filterRow
        onRowRemoving={onRowRemoving}
      />
    </div>
  );
};

export default ItemStoreTable;
