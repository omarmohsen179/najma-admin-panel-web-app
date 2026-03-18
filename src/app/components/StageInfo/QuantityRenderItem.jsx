import useAuth from "app/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { get_name } from "../../store/DataReducer";
import LabelBox from "../components/Inputs/LabelBox";

export default function QuantityRenderItem({ data, col }) {
  const { t, i18n } = useTranslation();
  const lookups = useAuth().lookups;
  return (
    <>
      <h2>{data?.Title}</h2>
      <div className={"row"}>
        <div className={col}>
          <LabelBox
            label={t("Total")}
            value={data?.data
              ?.map((e) => e.Value)
              .reduce((partialSum, a) => partialSum + a, 0)}
            type="number"
          />
        </div>
        {data?.data?.map((e) => (
          <div className={col}>
            <LabelBox
              label={get_name(lookups.Sizes, e.SizeId)}
              value={e.Value}
              type="number"
            />
          </div>
        ))}
      </div>
    </>
  );
}
