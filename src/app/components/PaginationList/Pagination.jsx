import { useCallback, useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { memo } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import "./style.css";

const Pagination = ({
  GetElements,
  FilterForm,
  defaultData,
  Card,
  OnEdit,
  singlePageOnce = false,
  horizontal = false,
  PageSize = 5,
  cardClasses = "",
  DetailsComponent,
  PageIndex = 1,
  cardContainerClasses = "",
  // cardWidth = "100%",
  // setLoading,
  // loading = false,
  ...passToCard
}) => {
  const defualtDataPagenation = useRef({
    TotalCount: 0,
    PageSize: PageSize,
    PageIndex: PageIndex,
    PagesCount: 0,
    Data: [],
  });

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    ...defualtDataPagenation.current,
    ...defaultData,
  });
  useEffect(() => {
    setValues({
      ...defualtDataPagenation.current,
      ...defaultData,
    });
  }, [defaultData]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setValues({
      ...defualtDataPagenation.current,
      ...defaultData,
    });
    GetData(PageIndex, true);
  }, []);
  const selectedElementEdit = useCallback((id, obj) => {
    setValues((prev) => ({
      ...prev,
      Data: prev.Data.map((e) => (e.Id == id ? { ...e, ...obj } : e)),
    }));
  }, []);
  const selectedElementDelete = useCallback((id) => {
    setValues((prev) => ({
      ...prev,
      Data: prev.Data.filter((e) => e.Id != id),
    }));
  }, []);
  const GetData = (index = PageIndex, refresh = false) => {
    if (values.PageIndex != index || refresh) {
      setLoading(true);
      GetElements({ ...values, PageIndex: index, SkipOld: singlePageOnce })
        .then((res) => {
          setValues((prev) => ({
            ...prev,
            ...res,
            Data:
              !singlePageOnce && !refresh
                ? [...prev.Data, ...res.Data]
                : res.Data,
            // Data:
            // !singlePageOnce &&
            //   (index != 1 && !singlePageOnce) || res.Data.length <= res.PageSize
            //     ? [...prev.Data, ...res.Data]
            //     : res.Data,
          }));
        })
        .catch((err) => {})
        .finally(() => setLoading(false));
    }
  };
  const Change = useCallback(({ name, value }) => {
    setValues((prev) => ({
      ...prev,

      [name]: value,
    }));
  }, []);
  // useEffect(() => {
  //   GetData(PageIndex, true);
  // }, [values]);
  return (
    <div>
      {FilterForm && (
        <div style={{ padding: "10px" }}>
          <FilterForm values={values} Change={Change} />
          <div className="col-lg-3 col-md-6 col-sm-12">
            <ButtonComponent
              title={"Filter"}
              type="button"
              loading={loading}
              onClick={() => GetData(PageIndex, true)}
            />
          </div>
        </div>
      )}
      {DetailsComponent && <DetailsComponent {...values} />}
      <div style={{ maxWidth: "45px", padding: "10px" }}>
        <ButtonComponent
          icon="fas fa-undo"
          type="button"
          loading={loading}
          width="45px"
          onClick={() => GetData(PageIndex, true)}
        />
      </div>
      <div
        style={{
          display: horizontal ? "flex" : "block",
          // justifyContent: "center",
          overflowX: horizontal ? "auto" : "hidden",
          overflowY: !horizontal ? "auto" : "hidden",
          width: "100%",
        }}
      >
        <div
          className={horizontal ? "row" : ""}
          style={{ display: horizontal ? "" : "block", maxWidth: "100%" }}
        >
          {values.PageIndex > PageIndex && horizontal && (
            <div
              className={cardClasses}
              style={{
                alignSelf: "center",
                padding: 5,
                zIndex: 2,
              }}
            >
              <ButtonComponent
                icon={
                  i18n.language == "ar"
                    ? "fas fa-angle-right"
                    : "fas fa-angle-left"
                }
                width="50px"
                type="button"
                loading={loading}
                onClick={() => GetData(values.PageIndex - 1)}
              />
            </div>
          )}
          {values.Data.map((data, index) => {
            return (
              <div key={index} className={cardClasses}>
                <Card
                  data={data}
                  setLoading={setLoading}
                  index={index}
                  OnEdit={OnEdit}
                  loading={loading}
                  selectedElementEdit={selectedElementEdit}
                  selectedElementDelete={selectedElementDelete}
                  {...passToCard}
                />
              </div>
            );
          })}

          {values.PageIndex < values.PagesCount && horizontal && (
            <div
              className={cardClasses}
              style={{
                alignSelf: "center",
                padding: 5,
                zIndex: 2,
              }}
            >
              <ButtonComponent
                icon={
                  i18n.language == "ar"
                    ? "fas fa-angle-left"
                    : "fas fa-angle-right"
                }
                width="50px"
                type="button"
                loading={loading}
                onClick={() => {
                  GetData(values.PageIndex + 1);
                }}
              />
            </div>
          )}
        </div>
        {values.PageIndex < values.PagesCount && !horizontal && (
          <div
            style={{
              width: "100%",
              padding: 4,
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "100px" }}>
              <ButtonComponent
                title={"More"}
                loading={loading}
                type="button"
                onClick={() => GetData(values.PageIndex + 1)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Pagination);
