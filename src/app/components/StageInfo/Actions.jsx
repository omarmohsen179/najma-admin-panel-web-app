import React, { useEffect, useState } from "react";
import InputTableEdit from "../masterTable/InputTableEdit";
import useAuth from "app/hooks/useAuth";
import Dialog from "../Dialog/Dialog";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useCallback } from "react";

import { useTranslation } from "react-i18next";
import { CheckBox, DateTime, NumberBox, SelectBox } from "../components/Inputs";
import notify from "devextreme/ui/notify";
import { DELETE_ACTION, GROUP_PAY } from "./Api";
import { DisplayNumber } from "../DateFunction";
import { GROUP_ACTIONS } from "app/pages/Actions/Api";
import LabelBox from "../components/Inputs/LabelBox";
import StaticTable from "../masterTable/StaticTable";
import FilterFormActions from "./FilterFormActions";

export default function Actions({
  dialog = true,
  ProductionOrderId = 0,
  visible,
  close,
  Acc = true,
  canDelete = false,
  anotherCols = [],
  pay = false,
}) {
  const [data, setData] = useState([]);
  const { t, i18n } = useTranslation();

  const lookups = useAuth().lookups;
  const [values, setValues] = useState({
    To: new Date(),
    From: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 2
    ),
    ProductionOrderId: 0,
    StageId: 0,
    GroupId: 0,
    Paid: true,
    All: true,
    ModelNo: 0,
  });
  const handleChange = useCallback(({ name, value }) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    visible && getData();
  }, [visible]);
  useEffect(() => {
    setValues((prev) => ({ ...prev, ProductionOrderId }));
  }, [ProductionOrderId]);
  const getData = () => {
    setLoading(true);
    setData([]);
    GROUP_ACTIONS(values)
      .then((res) => {
        setData(res);
      })
      .catch((err) => {})
      .finally(() => setLoading(false));
  };
  const [loading, setLoading] = useState(false);
  const OnSubmit = useCallback((values) => {
    // if (values.Send < 0 || !values.Send) {
    //   notify(
    //     {
    //       message: t("fill the inputs"),
    //       width: 600,
    //     },
    //     "error",
    //     3000
    //   );
    //   return;
    // }
    // if (values.Send > values.TotalLabor) {
    //   notify(
    //     {
    //       message: t("you pay more"),
    //       width: 600,
    //     },
    //     "error",
    //     3000
    //   );
    //   return;
    // }
    setLoading(true);
    GROUP_PAY(values)
      .then((res) => {
        notify(t("saved successfully"), "success", 3000);
      })
      .catch((err) => {
        console.log(err);
        notify(
          t(err ? err.Message : "Error in information. try again!"),
          "error",
          3000
        );
      })
      .finally((err) => {
        setLoading(false);
      });
  }, []);
  const cols = [
    {
      caption: "مدفوع",
      field: "Paid",
      captionEn: "Paid",
      customizeText: (data) => {
        return (
          <div>
            <i
              style={{ color: data.value ? "green" : "red" }}
              className="fas fa-circle"
            ></i>
          </div>
        );
      },
    },
    {
      caption: "رقم الموديل",
      field: "ModelId",
      captionEn: "Model No.",
      display: "Number",
      value: "Id",
      groupIndex: 0,
      data: lookups.Models,
    },
    {
      caption: "تاريخ",
      field: "Date",
      captionEn: "Date",
      type: "date",
    },

    {
      caption: "من المرحلة",
      field: "FromStageId",
      captionEn: "Stage",
      display: "StageName",
      value: "Id",
      groupIndex: 0,
      data: lookups.Stages,
    },
    {
      caption: "من المجموعة",
      field: "FromGroupId",
      captionEn: "Group",
      display: "GroupName",
      value: "Id",
      groupIndex: 0,
      data: lookups.Groups,
    },

    {
      caption: "قِطَع",
      field: "Pieces",
      captionEn: "Pieces",
    },
    {
      caption: "مرتجع",
      field: "TotalRefund",
      captionEn: "Returned",
    },
    {
      caption: "تم ألغيت",
      field: "Canceled",
      captionEn: "Canceled",
    },
    {
      caption: "تكلفة القطعة",
      field: "Labor",
      captionEn: "Piece Cost",
    },
    {
      caption: "التكلفة الإجمالية",
      field: "TotalLabor",
      captionEn: "Total Cost",
    },
    {
      caption: "النقود المستلمة",
      field: "Actual",
      captionEn: "Received Money",
      customizeText: ({ data, index, handleChange }) => {
        return (
          <div>
            <>{DisplayNumber(data["Actual"], i18n)}</>
          </div>
        );
      },
    },
    {
      caption: "إرسال الأموال",
      field: "Actual",
      captionEn: "Send Money",
      customizeText: ({ data, index, handleChange }) => {
        return (
          <div>
            {!data.Paid ? (
              <NumberBox
                value={data["Send"]}
                name="Send"
                handleChange={(e) => handleChange(data, e)}
                nonNegative={false}
              />
            ) : null}
          </div>
        );
      },
    },
    {
      caption: "مدفوع",
      field: "cols",
      captionEn: "Pay",
      customizeText: ({ data }) => {
        return (
          <div>
            {!data.Paid && pay && (
              <ButtonComponent
                icon={"Save"}
                onClick={() => OnSubmit(data)}
                title={"Pay"}
                loading={loading}
              />
            )}
          </div>
        );
      },
    },
  ];
  const onDelete = (x) => {
    setLoading(true);
    DELETE_ACTION(x)
      .then(() => {
        const test = data.filter((el) => el["Id"] != x.Id);
        setData(test);
        notify(t("Deleted successfully"), "success", 3000);
      })
      .catch((e) => {
        console.log(e);
        notify("Error in information. try again! ", "error", 3000);
      })
      .finally(() => setLoading(false));
  };
  const renderCols =
    lookups.Roles.find((role) => role == "GroupsActionsCost") != null
      ? [...cols, ...anotherCols]
      : [...cols, ...anotherCols].filter(
          (e) => !["Actual", "TotalLabor", "Paid"].includes(e.field)
        );
  return dialog ? (
    <Dialog
      close={close}
      visible={visible}
      loading={false}
      title={"Actions"}
      showTitle={!false}
      full
    >
      <div>
        <FilterFormActions
          data={data}
          getData={getData}
          handleChange={handleChange}
          values={values}
          loading={loading}
        />

        <StaticTable dataSource={data} colAttributes={renderCols} />
      </div>
    </Dialog>
  ) : (
    <div>
      <FilterFormActions
        data={data}
        getData={getData}
        handleChange={handleChange}
        values={values}
        loading={loading}
      />

      <StaticTable
        dataSource={data}
        canDelete={canDelete}
        onDelete={onDelete}
        colAttributes={renderCols}
      />
    </div>
  );
}
