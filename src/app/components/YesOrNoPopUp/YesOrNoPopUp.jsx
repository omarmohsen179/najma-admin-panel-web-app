import React from "react";
import { Popup } from "devextreme-react/popup";
import { Button } from "devextreme-react/button";
import { useTranslation } from "react-i18next";
function YesOrNoPopUp({ setdialog, dailog, OnDelete, onEdit, data }) {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <Popup
        maxWidth={1000}
        title={""}
        minWidth={150}
        minHeight={100}
        height={200}
        width={350}
        showTitle={true}
        dragEnabled={false}
        closeOnOutsideClick={true}
        visible={dailog}
        onHiding={() => setdialog(false)}
      >
        <div className="contianer" style={{ textAlign: "center" }}>
          <h3>{t("Are you sure ?")}</h3>

          <div className="formButtons d-flex justify-content-around pt-3">
            <Button
              text={t("Ok")}
              icon="check"
              type="success"
              rtlEnabled={true}
              width={"45%"}
              onClick={() => {
                onEdit && onEdit();
                OnDelete && OnDelete();
                setdialog(false);
              }}
            />
            <Button
              text={t("Cancel")}
              icon="close"
              type="danger"
              rtlEnabled={true}
              width={"45%"}
              onClick={() => setdialog(false)}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default YesOrNoPopUp;
