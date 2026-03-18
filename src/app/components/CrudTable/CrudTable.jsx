import notify from "devextreme/ui/notify";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import YesOrNoPopUp from "../YesOrNoPopUp/YesOrNoPopUp";
import InputTableEdit from "../masterTable/InputTableEdit";
import MasterTable from "../masterTable/MasterTable";
import CrudForm from "./CrudForm";

function CrudTable({
  GET,
  DELETE,
  EDIT,
  defaultValues,
  Key = "Id",
  ElementForm,
  add = true,
  title,
  columnAttributes,
  summaryItems,
  view,
  loading,
  setloading,
  setSelectedId = () => {},
  selectedId,
  dataSource,
  selectedRowKeys = [],
  MasterRenderDetail,
  validation,
  removeApiPayload,
  apiPayload,
  remoteOperations = false,
  FormData = () => {},
  onDeleteFunction,
  height = "600px",
  canAdd = true,
  groupPanel = false,
  keyExpr = "Id",
  tableGroupSummary,
  getRowStyle,
  summaries = [],
}) {
  const [data, setdata] = useState([]);

  const [cols, setCols] = useState([]);
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState(
    defaultValues ? defaultValues.current : {}
  );
  const [popup, setPopup] = useState(false);
  const [action, setAction] = useState(false);
  const [YesOrNo, setYesOrNo] = useState({ id: 0, state: false });
  useEffect(() => {
    if (GET && remoteOperations) {
      setloading(true);
      GET(selectedId)
        .then((res) => {
          setdata(res);
        })
        .catch(() => {})
        .finally(() => setloading(false));
    } else setdata(dataSource);
  }, [selectedId, action, dataSource]);

  const handleChange = useCallback(({ name, value }) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);
  const onAdd = useCallback(() => {
    setValues(defaultValues.current);
    setPopup(true);
  }, []);
  const onEdit = useCallback(
    (res) => {
      setValues({ ...defaultValues.current, ...res });
      setPopup(true);
    },
    [defaultValues]
  );

  const OnDelete = (row) => {
    if (YesOrNo.id <= 0 && !onDeleteFunction) {
      // notify("Error in information. select Again! ");
      return;
    }

    if (!onDeleteFunction) {
      setloading(true);
      setAction(true);

      DELETE(YesOrNo.id, YesOrNo.data)
        .then(() => {
          const test = data.filter((el) => el[Key] != YesOrNo.id);

          setdata(test);
          notify(t("Deleted successfully"), "success", 3000);
        })
        .catch((e) => {
          notify("Error in information. try again! ", "error", 3000);
        })
        .finally(() => {
          setloading(false);
          setAction(false);
        });
    } else {
      setAction(true);
      onDeleteFunction(YesOrNo.id, YesOrNo.data);
      setAction(false);
    }
  };

  const OnSubmit = useCallback(
    async (id) => {
      if (validation(values)) {
        notify(t("Please Fill the inputs"), "error", 3000);
        return;
      }
      let formData = new FormData();
      for (let [key, value] of Object.entries(values)) {
        formData.append(key.toString(), value !== null ? value : "");
      }
      setloading(true);
      setAction(false);
      EDIT(values)
        .then((res) => {
          setAction(true);
          setValues(defaultValues.current);
          setPopup(false);
        })
        .catch((err) => {
          notify("Error in information. try again! ", "error", 3000);
        })
        .finally(() => setloading(false));
    },
    [data, Key, values, validation]
  );

  const setPopupStatus = useCallback((e) => {
    setPopup(e);
  }, []);
  useEffect(() => {
    setCols(
      // !view
      //   ? [
      //       {
      //         dataType: "buttons",
      //         //   alignment: "center",
      //         widthRatio: "50",
      //         buttons:
      //           DELETE || onDeleteFunction
      //             ? [
      //                 { onClick: onEdit, icon: "fas fa-pen" },
      //                 {
      //                   onClick: (row) => {
      //                     setYesOrNo({ id: row[Key], state: true, data: row });
      //                   },
      //                   icon: "fas fa-trash",
      //                 },
      //               ]
      //             : [{ onClick: onEdit, icon: "fas fa-pen" }],
      //       },
      //       ...columnAttributes,
      //     ]
      //   :
      columnAttributes
    );
  }, [columnAttributes, view]);
  const setSelected = useCallback(
    (e) => setSelectedId(e.selectedRowKeys[0]),
    []
  );
  const summary = [
    {
      column: "Id",
      summaryType: "count",
      valueFormat: "currency",
      cssClass: "summaryNetSum",
      showInColumn: "Id",
      customizeText: (data) => {
        return `${t("Count")}: ${data.value} `;
      },
    },
  ];
  return (
    <div style={{ padding: "10px", width: "100%" }}>
      <h1 style={{ textAlign: "center" }}>{t(title)}</h1>

      <div style={{ direction: "ltr" }}>
        <MasterTable
          key={Key}
          onDelete={(row) => {
            setYesOrNo({ id: row[Key], state: true, data: row });
          }}
          summaryItems={[...summary, ...summaries]}
          canEdit={!view && EDIT}
          canDelete={!view && onDeleteFunction}
          onEdit={onEdit}
          dataSource={data}
          colAttributes={cols}
          getRowStyle={getRowStyle}
        />
      </div>
      {/* <YesOrNoPopUp
        dailog={YesOrNo.state}
        setdialog={(e) => setYesOrNo({ id: 0, state: e })}
        OnDelete={OnDelete}
      />
      {!view && (
        <CrudForm
          data={values}
          itemValues={values}
          handleChange={handleChange}
          ElementForm={ElementForm}
          setLoading={setloading}
          setPopupStatus={setPopupStatus}
          title={title}
          loading={loading}
          status={popup}
          FormData={FormData}
          Submit={OnSubmit}
        />
      )} */}
    </div>
  );
}

export default memo(CrudTable);
