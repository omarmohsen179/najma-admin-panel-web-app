import FilterForm from "app/pages/Order/Components/FilterForm";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import LabelBox from "../components/Inputs/LabelBox";
import { useTranslation } from "react-i18next";
import useAuth from "app/hooks/useAuth";

export default function OrdersFilteredList({ GET_ORDERS, OrderCard }) {
  const defaultData = useRef({
    To: new Date(),
    From: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 2
    ),
    Key: "CreatedOn",
    State: 3,
    ModelNo: 0,
    StageId: 0,
    OrderNo: 0,
    Season: -1,
    CategoryId: 0,
    RequestsType: 3,
    SeasonYear: 0,
  });
  const [values, setValues] = useState(defaultData.current);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const onHiding = () => setLoading(false);
  const [data, setData] = useState([]);
  // useEffect(() => getData(), []);
  const getData = () => {
    setLoading(true);
    setData([]);
    GET_ORDERS({ ...values, PageSize: 10000 })
      .then((res) => {
        setData(res);
      })
      .catch((err) => {})
      .finally(() => setLoading(false));
  };
  var deletex = useCallback(
    (id) => {
      setData(data.filter((e) => e.Id != id));
    },
    [data]
  );
  const Change = useCallback(({ name, value }) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);
  const edit = useCallback(
    (id, obj) => {
      setData(data.map((e) => (e.Id == id ? { ...e, ...obj } : e)));
    },
    [data]
  );
  const lookups = useAuth().lookups;
  const calcAcualForPo = (po) =>
    po?.PassedStages.filter(
      (e) => !lookups.Stages.find((ex) => ex.Id == e.StageId).SetQuantity
    )
      .flatMap((e) =>
        e.Quantities.flatMap((e) => e.Quantities.flatMap((ex) => ex?.Value))
      )
      .filter((e) => e > 0)
      .reduce((partialSum, a) => partialSum + a, 0);
  const calculateAtcual = useCallback(() => {
    return values.StageId > 0
      ? data
          .flatMap((ele) =>
            ele?.PassedStages.filter((e) => e.StageId == values.StageId)
              .flatMap((e) =>
                e.Quantities.flatMap((e) =>
                  e.Quantities.filter((e) => e.Value > 0).flatMap(
                    (ex) => ex?.Value
                  )
                )
              )
              .reduce((partialSum, a) => partialSum + a, 0)
          )
          .reduce((partialSum, a) => partialSum + a, 0)
      : data
          .map((ele) => calcAcualForPo(ele))
          .reduce((partialSum, a) => partialSum + a, 0);
  }, [values, data]);
  return (
    <>
      <FilterForm Change={Change} values={values} />
      <ButtonComponent
        title={"Filter"}
        type="button"
        loading={loading}
        onClick={getData}
        pressOnEnter
      />
      <div className="col-lg-6 col-md-6 col-sm-12">
        <LabelBox label={t("Count")} value={data.length} type="number" />
      </div>
      <div className="col-lg-6 col-md-6 col-sm-12">
        <LabelBox
          label={t("Pieces Planning")}
          value={data
            .map((ele) =>
              ele?.RecipeInfo.Quantities.map((e) => e["Value"]).reduce(
                (partialSum, a) => partialSum + a,
                0
              )
            )
            .reduce((partialSum, a) => partialSum + a, 0)}
          type="number"
        />
        <LabelBox
          label={t("Pieces Actual")}
          value={calculateAtcual()}
          type="number"
        />
      </div>
      {data.map((ele, index) => {
        return (
          <div key={index}>
            <OrderCard
              data={ele}
              setLoading={setLoading}
              index={index}
              loading={loading}
              selectedElementEdit={edit}
              selectedElementDelete={deletex}
            />
          </div>
        );
      })}
    </>
  );
}
