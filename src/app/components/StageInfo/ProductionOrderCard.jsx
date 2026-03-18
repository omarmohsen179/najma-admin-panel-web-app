import { Box, Icon, IconButton, Menu, MenuItem } from "@mui/material";
import useAuth from "app/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Quantities from "../../pages/Recipe/components/modelTabs/Quantities";
import { get_name } from "../../store/DataReducer";
import Dialog from "../Dialog/Dialog";
import ImagesDisplay from "../ImagesDisplay/ImagesDisplay";
import LabelBox from "../components/Inputs/LabelBox";
import Actions from "./Actions";

import SellPrice from "./SellPrice";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { REORDER } from "./Api";
import notify from "devextreme/ui/notify";
export default function ProductionOrderCard({
  values,
  Actual,
  confirmStage,
  selectedElementEdit,
  Planning = false,
  ComMenuItem = () => {},
}) {
  const { t, i18n } = useTranslation();
  const lookups = useAuth().lookups;
  const [displayPlanning, setDisplayPlanning] = useState(false);
  const [canSetCost, setCanSetCost] = useState(false);
  useEffect(() => {
    setCanSetCost(lookups.Roles.find((role) => role == "ProductionCost"));
  }, []);
  const [visible, setvisible] = useState(false);
  const [actions, setActions] = useState(false);
  const [pay, setPay] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  const calcAcualForPo = (po) =>
    po?.PassedStages.filter(
      (e) => !lookups.Stages.find((ex) => ex.Id == e.StageId).SetQuantity
    )
      .flatMap((e) =>
        e.Quantities.flatMap((e) => e.Quantities.flatMap((ex) => ex?.Value))
      )
      .filter((e) => e > 0)
      .reduce((partialSum, a) => partialSum + a, 0);
  return (
    <div>
      <Box>
        <IconButton
          variant="outlined"
          aria-haspopup="true"
          onClick={handleClick}
          aria-owns={anchorEl ? "simple-menu" : undefined}
        >
          <Icon>more_vert</Icon>
        </IconButton>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <ComMenuItem />
          <MenuItem onClick={() => setvisible(true)}>
            {t("Full Details")}
          </MenuItem>
          {!Planning && (
            <>
              {/* {values?.Id ? (
                <MenuItem
                  onClick={() => {
                    setLoading(true);
                    GET_ORDER_BY_ID(values.Id)
                      .then((res) => {
                        notify(
                          {
                            message: t("Done"),
                            width: 600,
                          },
                          "success",
                          3000
                        );
                        selectedElementEdit(values.Id, res);
                      })
                      .catch((err) => {
                        console.log(err);
                        notify(t("check internet connection"), "error", 3000);
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  {t("Reload")}
                </MenuItem>
              ) : null} */}
              {canSetCost ? (
                <MenuItem onClick={() => setPay(true)}>
                  {t("Sell Price")}
                </MenuItem>
              ) : null}
              <MenuItem
                onClick={() => setActions(true)}
                // style={{
                //   color:
                //     values.Actions.find((e) => e.Paid == false) != null &&
                //     "red",
                // }}
              >
                {t("Actions")}
              </MenuItem>

              {values?.PendingStage && values?.PendingStage.length > 0 && (
                <MenuItem
                  onClick={() => confirmStage && confirmStage(true)}
                  style={{ color: "red" }}
                >
                  {t("Pending")}
                </MenuItem>
              )}
            </>
          )}
        </Menu>
        {/* {(values?.PendingStage && values?.PendingStage.length > 0) ||
        values?.Actions?.find((e) => e.Paid == false) != null ? (
          <i className="fas fa-exclamation" style={{ color: "red" }}></i>
        ) : null} */}
      </Box>
      <div
        className="row"
        style={{
          margin: 0,
          padding: 10,
          // maxHeight: 400,
          overflow: "auto",
        }}
      >
        <div className={"col-lg-6 col-sm-12"}>
          {values?.RecipeInfo.Recipe?.ImagePath && (
            <ImagesDisplay
              height="200px"
              data={[values.RecipeInfo?.Recipe?.ImagePath]}
            />
          )}{" "}
        </div>
        <div className={"col-lg-6 col-sm-12"}>
          <LabelBox
            label={t("Model No.")}
            value={values?.ModelCode}
            type="number"
          />
          {values?.Id > 0 && (
            <LabelBox
              label={t("Order No.")}
              value={values?.Id}
              type={"number"}
            />
          )}
          {values?.RecipeInfo.CreatedOn && (
            <LabelBox
              label={t("Order Date")}
              value={values.RecipeInfo.CreatedOn}
              type="date"
            />
          )}
          <LabelBox
            label={t("Store Elements Count")}
            value={values?.Orders?.length}
            labelWidth="200px"
            type="number"
          />
          <LabelBox
            label={t("Season")}
            value={get_name(
              lookups.seasonData,
              values?.RecipeInfo.Recipe.Season,
              i18n
            )}
          />
          <LabelBox
            label={t("Year")}
            value={values?.RecipeInfo.Recipe.SeasonYear}
            type="number"
          />
          <LabelBox
            label={t("Category")}
            value={get_name(
              lookups.Categories,
              values?.RecipeInfo.Recipe.Target.CategoryId
            )}
          />
          <LabelBox
            label={t("Planning Quantity")}
            labelWidth="200px"
            value={values?.RecipeInfo.Quantities.map((e) => e["Value"]).reduce(
              (partialSum, a) => partialSum + a,
              0
            )}
            type="number"
          />
          {values?.PassedStages && values?.PassedStages.length > 0 ? (
            <LabelBox
              label={t("Actual Quantity")}
              labelWidth="200px"
              value={calcAcualForPo(values)}
              type="number"
            />
          ) : null}

          {values?.StoreState != null && (
            <LabelBox
              label={"Store"}
              important
              value={
                values.StoreState === 0
                  ? t("Pending")
                  : values.StoreState === 2
                  ? t("Rejected")
                  : t("Accepted")
              }
            />
          )}
          {values?.StoreState === 2 && (
            <LabelBox label={"Note"} value={values.StoreNote} />
          )}
          {values?.ProductionOrders?.map((e) => (
            <div>
              <LabelBox label={"Order Id"} value={e.Id} important />
              <LabelBox
                label={"Store State"}
                value={
                  e.StoreState === 0
                    ? t("Pending")
                    : e.StoreState === 2
                    ? t("Rejected")
                    : t("Accepted")
                }
                important
              />
              <LabelBox label={"Store Note"} value={e.StoreNote} important />
            </div>
          ))}
          {values?.ProductionOrders != null &&
          values?.ProductionOrders.length > 0 ? (
            <ButtonComponent
              title={t("Order again")}
              onClick={() => {
                REORDER()
                  .then((res) => {
                    notify(t("saved successfully"), "success", 3000);
                  })
                  .catch((err) => {
                    notify(
                      t(err ? err.Message : "Error in information. try again!"),
                      "error",
                      3000
                    );
                  })
                  .finally((err) => {});
              }}
            />
          ) : null}
        </div>
      </div>

      {values?.Id && (
        <Actions
          ProductionOrderId={values?.Id}
          visible={actions}
          close={() => setActions(false)}
          anotherCols={[
            {
              caption: "إلى المرحلة",
              field: "ToStageId",
              captionEn: "To Stage",
              display: "StageName",
              value: "Id",
              groupIndex: 0,
              data: lookups.Stages,
            },
            {
              caption: "الى المجموعة",
              field: "ToGroupId",
              captionEn: "To Group",
              display: "GroupName",
              value: "Id",
              groupIndex: 0,
              data: lookups.Groups,
            },
          ]}
        />
      )}

      <SellPrice
        data={values}
        visible={pay}
        close={() => setPay(false)}
        selectedElementEdit={selectedElementEdit}
      />
      <Dialog
        close={() => setvisible(false)}
        visible={visible}
        loading={false}
        title={"Order"}
        showTitle={!false}
        full
      >
        <div className="container">
          {values && (
            <>
              {values.RecipeInfo && (
                <>
                  <h2>{t("Design")}</h2>
                  <div
                    className="row"
                    style={{
                      margin: 0,
                      padding: 10,
                      // maxHeight: 400,
                    }}
                  >
                    <div>
                      <LabelBox
                        label={t("Type")}
                        value={get_name(
                          lookups.RecipeTypes,
                          values.RecipeInfo.Recipe.Type,
                          i18n
                        )}
                      />

                      {canSetCost && (
                        <>
                          <LabelBox
                            label={t("Cost")}
                            value={values.RecipeInfo.Cost}
                            type="number"
                          />
                        </>
                      )}
                      <LabelBox
                        label={t("Note")}
                        value={
                          values.RecipeInfo.Recipe.Note
                            ? values.RecipeInfo.Recipe.Note
                            : ""
                        }
                      />
                      <LabelBox
                        label={t("Order Note")}
                        value={values.RecipeInfo.Note}
                      />
                    </div>
                    {Planning ? (
                      <div className="col-12">
                        <h4
                          style={{
                            float: i18n.language == "en" ? "left" : "right",
                            fontWeight: 600,
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => setDisplayPlanning(!displayPlanning)}
                        >
                          {t("Planning")} <i className="fas fa-down-long"></i>
                        </h4>
                        <Quantities
                          values={values.RecipeInfo}
                          displayQuantities={displayPlanning}
                          items={values.Orders.Items}
                        />
                      </div>
                    ) : null}
                    {Actual ? (
                      <div className="col-12">
                        <h4
                          style={{
                            float: i18n.language == "en" ? "left" : "right",
                            fontWeight: 600,
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => setDisplayPlanning(!displayPlanning)}
                        >
                          {t("Actual")} <i className="fas fa-down-long"></i>
                        </h4>
                        <Quantities
                          values={{ Quantities: values.Actual }}
                          displayQuantities={displayPlanning}
                          items={values.Orders.Items}
                        />
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </>
          )}
          <h2>
            {values?.StoreState != null && (
              <LabelBox
                label={"Store"}
                important
                value={
                  values.StoreState === 0
                    ? t("Pending")
                    : values.StoreState === 2
                    ? t("Rejected")
                    : t("Accepted")
                }
              />
            )}
            {values?.StoreState === 2 && (
              <LabelBox label={"Note"} value={values.StoreNote} />
            )}
          </h2>
          {/* <ProductionOrderElementList values={values} /> */}

          {/* <>
            <h2>{t("BarCode")}</h2>
            <div
              className="row"
              style={{
                margin: 0,
                padding: 10,
              }}
            >
               {values?.RecipeInfo && (
                <BarCode
                  values={values?.RecipeInfo}
                  displayQuantities={displayPlanning}
                  items={values.Orders.Items}
                  modelId={values?.RecipeInfo.Recipe.TargetId}
                  season={values?.RecipeInfo.Recipe.Season}
                  year={values.RecipeInfo.Recipe.SeasonYear}
                />
              )} 
            </div>
          </> */}
        </div>
      </Dialog>
    </div>
  );
}
