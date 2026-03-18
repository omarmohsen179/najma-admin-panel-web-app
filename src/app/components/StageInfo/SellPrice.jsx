import ButtonComponent from "app/components/ButtonComponent/ButtonComponent";
import Dialog from "app/components/Dialog/Dialog";
import { NumberBox, TextBox } from "app/components/components/Inputs";
import useAuth from "app/hooks/useAuth";
import notify from "devextreme/ui/notify";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SET_SELL_PRICE } from "./Api";
export default function SellPrice({
  visible,
  close,
  data = {},
  selectedElementEdit,
}) {
  const { t, i18n } = useTranslation();

  const [values, setValues] = useState({ GrouthPrice: 0 });
  const [loading, setLoading] = useState(false);
  const lookups = useAuth().lookups;
  const handleChange = useCallback(({ name, value }) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);
  useEffect(() => {
    setValues({
      Id: data.Id,
      GrouthPrice: data.GrouthPrice,
      CustomerPrice: data.CustomerPrice,
      Note: data.Note,
    });
  }, [data]);
  const OnSubmit = useCallback(() => {
    if (values.CustomerPrice == null || values.GrouthPrice == null) {
      notify(
        {
          message: t("fill the inputs"),
          width: 600,
        },
        "error",
        3000
      );
      return;
    }

    setLoading(true);
    SET_SELL_PRICE(values)
      .then((res) => {
        selectedElementEdit(values.Id, { ...data, ...values });
        close();
        notify(t("saved successfully"), "success", 3000);
      })
      .catch((err) => {
        notify(
          t(err ? err.Message : "Error in information. try again!"),
          "error",
          3000
        );
      })
      .finally((err) => {
        setLoading(false);
      });
  }, [values, data]);
  return (
    <>
      <Dialog
        close={close}
        visible={visible}
        loading={false}
        title={"Order"}
        showTitle={!false}
      >
        <div style={{ margin: 0 }} className="row">
          <div className="col-6">
            <NumberBox
              label={t("Customer Price")}
              value={values["CustomerPrice"]}
              name="CustomerPrice"
              handleChange={handleChange}
              requiredInput
            />
          </div>
          <div className="col-6">
            <NumberBox
              label={t("Gross Price")}
              value={values["GrouthPrice"]}
              name="GrouthPrice"
              handleChange={handleChange}
              requiredInput
            />
          </div>
          <div className="col-6">
            <TextBox
              label={t("Note")}
              value={values["Note"]}
              name="Note"
              handleChange={handleChange}
              requiredInput
            />
          </div>
          {/* <div className="col-6">
            <ButtonComponent
              icon={"close"}
              onClick={close}
              title={"close"}
              loading={loading}
            />
          </div> */}
          <div className="col-12">
            <ButtonComponent
              icon={"Save"}
              disabled={
                JSON.stringify({
                  Id: data.Id,
                  SellPrice: data.SellPrice,
                  Note: data.Note,
                }) == JSON.stringify(values)
              }
              onClick={OnSubmit}
              title={"Save"}
              loading={loading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
