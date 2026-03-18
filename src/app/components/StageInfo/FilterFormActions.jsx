import React from "react";
import { CheckBox, DateTime, NumberBox, SelectBox } from "../components/Inputs";
import LabelBox from "../components/Inputs/LabelBox";
import { useTranslation } from "react-i18next";
import useAuth from "app/hooks/useAuth";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

export default function FilterFormActions({
  handleChange,
  values,
  getData,
  data,
  loading,
}) {
  const { t, i18n } = useTranslation();
  const lookups = useAuth().lookups;
  return (
    <div>
      {" "}
      <div className="row" style={{ margin: 0 }}>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <DateTime
            label={t("From")}
            value={values["From"]}
            name="From"
            handleChange={handleChange}
            required={false}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <DateTime
            label={t("To")}
            value={values["To"]}
            name="To"
            handleChange={handleChange}
            required={false}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <SelectBox
            label={t("Stage")}
            dataSource={[
              {
                Id: 0,
                StageName: i18n.language == "en" ? "All" : "الكل",
              },
              ...lookups.Stages,
            ]}
            keys={{ id: "Id", name: "StageName" }}
            value={values?.StageId}
            labelWidth={200}
            name="StageId"
            requiredInput
            handleChange={handleChange}
          />
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          <SelectBox
            label={t("Group")}
            dataSource={[
              {
                Id: 0,
                GroupName: i18n.language == "en" ? "All" : "الكل",
              },
              ...lookups.Groups.filter((e) => e.StageId == values?.StageId),
            ]}
            keys={{ id: "Id", name: "GroupName" }}
            value={values?.GroupId}
            name="GroupId"
            requiredInput
            handleChange={handleChange}
          />
        </div>

        <div className="col-lg-6 col-md-6 col-sm-12">
          <NumberBox
            label={t("Model")}
            value={values["ModelNo"]}
            name="ModelNo"
            handleChange={handleChange}
            requiredInput
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <CheckBox
            label={t("Paid")}
            value={values["Paid"]}
            name="Paid"
            readOnly={values["All"]}
            handleChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <CheckBox
            label={t("All")}
            value={values["All"]}
            name="All"
            handleChange={handleChange}
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <ButtonComponent
            title={"Filter"}
            onClick={getData}
            loading={loading}
          />
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12">
          <LabelBox label={t("Count")} value={data.length} type="number" />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <LabelBox
            label={t("Pieces")}
            value={data
              ?.map((e) => e["Pieces"])
              .reduce((partialSum, a) => partialSum + a, 0)}
            type="number"
          />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-12">
          <LabelBox
            label={t("Cost")}
            value={data
              ?.map((e) => e["Actual"])
              .reduce((partialSum, a) => partialSum + a, 0)}
            type="number"
          />
        </div>
      </div>
    </div>
  );
}
