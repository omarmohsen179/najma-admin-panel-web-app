import useAuth from "app/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { groupByOrders, isDateBeforeToday } from "../../services/SharedData";
import { get_name } from "../../store/DataReducer";
import { CheckBox } from "../components/Inputs";
import LabelBox from "../components/Inputs/LabelBox";
import QuantityRenderItem from "./QuantityRenderItem";
export default function GroupInfo({ col, data }) {
  const { t, i18n } = useTranslation();
  const lookups = useAuth().lookups;

  return (
    <>
      <div className={"col-12"}>
        <hr />
      </div>
      {!data.Group?.IsIn && isDateBeforeToday(new Date(data.Group.EndDate)) && (
        <div className={col}>
          <i
            style={{ fontSize: "30px", color: "red" }}
            className="fas fa-circle"
          ></i>
        </div>
      )}
      <div className={col}>
        <LabelBox
          label={t("Group")}
          value={get_name(lookups.Groups, data.Group.GroupId)}
        />
      </div>
      <div className={col}>
        <LabelBox label={t("From")} value={data.Group.Date} type="date" />
      </div>
      <div className={col}>
        <LabelBox label={t("To")} value={data.Group.EndDate} type="date" />
      </div>{" "}
      <div className={col}>
        <CheckBox
          label={t("Is In")}
          value={data.Group?.IsIn || false}
          name="IsIn"
          readOnly={true}
        />
      </div>{" "}
      <div className={col}>
        <LabelBox
          label={t("Total")}
          value={data?.Quantities.map((e) => e.Value).reduce(
            (partialSum, a) => partialSum + a,
            0
          )}
          type="number"
        />
      </div>
      <div className="col-12">
        {groupByOrders(data?.Quantities, "RecipeModelNumber", lookups).map(
          (data, i) => (
            <QuantityRenderItem col={col} data={data} />
          )
        )}
      </div>
    </>
  );
}
