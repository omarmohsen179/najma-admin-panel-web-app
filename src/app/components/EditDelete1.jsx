import { confirm } from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "./Dialog/Dialog";
import InputTableEdit from "./masterTable/InputTableEdit";
import MasterTable from "./masterTable/MasterTable";

function EditDelete(props) {
  const {
    data, // Data Source
    columnAttributes, // Columns Names
    editDeleteStatus, // Determine if it's a delete or edit and on this adding recycle bin icon in delete case
    getEditData, // Setstate from your primary page to get on it the selected data
    close, // close function on deleteing خروج
    deleteItem, // Deleting row API ... you are to give it id only, regarding this data object has the id as "ID"
    visible,

    pagination = false,
    removeElement,
    Key = "Id",
    GET,
    DELETE,
    apiPayload,
    remoteOperations,
    selectedRowKeys,
  } = props;
  const DefualtData = useRef({
    ElementId: 0,
    CategoryId: 0,
    SizeId: 0,
    ColorId: 0,
    Season: -1,
    SeasonYear: 0,
  });

  const [values, setvalues] = useState(DefualtData.current);
  // To set the id of the selected row in it to enable deleting or editing on clicking ok.
  const selectedRowID = useRef("");
  const { t, i18n } = useTranslation();

  // helpers
  // Can delete popup
  let deletedPopUp = useCallback(() => {
    notify({ message: t("Deleted Successfully"), width: 600 }, "success", 3000);
    //  close();
  }, [close]);

  // Canot delete popup

  let notDeletedpopUp = useCallback((err) => {
    notify(
      {
        message: t("This item cannot be deleted"),
        width: 600,
      },
      "error",
      3000
    );
  }, []);

  // Handelers
  // Handle selection and setting selected row id to id storage

  let HandleDelete = useCallback(
    async (event) => {
      deleteItem(event.Id)
        .then((res) => {
          removeElement(event.Id);
          deletedPopUp();
        })
        .catch((err) => {
          notDeletedpopUp();
        });
    },
    [deleteItem, deletedPopUp, notDeletedpopUp]
  );

  // Handle double click on row of the table , mostly look like handle Ok except for parameter.
  let handleDoubleClick = useCallback(
    (event) => {
      if (editDeleteStatus === "delete") {
        let result = confirm(t("Are you sure you want to delete this check?"));
        result.then(
          (dialogResult) =>
            dialogResult && HandleDelete(event.selectedRowsData[0])
        );
      } else {
        getEditData(event.selectedRowsData[0]);
        close();
      }
    },
    [editDeleteStatus, close, t, HandleDelete, getEditData]
  );

  // handle delete function depending on id of row "on clicking on recycle bin icon"
  const [isMobile, setIsMobile] = useState(false);

  //choose the screen size
  const handleResize = () => {
    if (window.innerWidth < 720) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  // create an event listener
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);
  return (
    <Dialog
      title={editDeleteStatus == "edit" ? t("Edit") : t("Delete")}
      full
      visible={visible}
      close={close}
    >
      <div className="container">
        <MasterTable
          onDelete={HandleDelete}
          onSelectionChanged={handleDoubleClick}
          canEdit={false}
          canDelete={editDeleteStatus === "delete" ? true : false}
          dataSource={data}
          colAttributes={columnAttributes}
        />
      </div>
    </Dialog>
  );
}

export default React.memo(EditDelete);
