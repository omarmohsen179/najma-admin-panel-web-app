import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Item, TabPanel } from "devextreme-react/tab-panel";
import { memo } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import Pagination from "./Pagination";
import "./style.css";
import InputTableEdit from "../masterTable/InputTableEdit";
import StoreRequests from "app/pages/StoreData/Requests/StoreRequests";

const PaginationList = (props) => {
  const {
    SubmitForm,
    title,
    FilterForm,
    submitFormHeight = 400,
    InvoiceCard,
    Request,
    defaultData,
    GetElementsInvoice,
    FilterFormInvoice,
  } = props;

  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const onHiding = () => setLoading(false);

  return (
    <PageLayout title={title} loading={loading} onHiding={onHiding}>
      <>
        <TabPanel swipeEnabled={false} animationEnabled={true}>
          {SubmitForm && (
            <Item
              title={t("Submit")}
              render={() => (
                <>
                  <SubmitForm setLoading={setLoading} />
                </>
              )}
            />
          )}
          {/* <Item
            title={t("Requests")}
            render={() => (
              <>
                <StoreRequests hasCommon={true} />
              </>
            )}
          /> */}
          <Item
            title={t("Requests")}
            render={() => (
              <>
                <Pagination
                  defaultData={defaultData}
                  GetElements={GetElementsInvoice}
                  FilterForm={FilterFormInvoice}
                  Card={InvoiceCard}
                  cardClasses={"col-12"}
                  setLoading={setLoading}
                  submitFormHeight={1600}
                />
              </>
            )}
          />
        </TabPanel>
      </>
    </PageLayout>
  );
};

export default memo(PaginationList);
