import { styled } from "@mui/material";
import { Breadcrumb, MatxLoading, SimpleCard } from "app/components";
import useAuth from "app/hooks/useAuth";
import { category, pages } from "app/navigations";
import "devextreme/dist/css/dx.light.css";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
const ContentBox = styled("div")(({ i18n, theme }) => ({
  // margin: "30px",
  direction: i18n.language == "en" ? "lrt" : "rtl",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));
const PageLayout = ({ children, loading = false, onHiding, submit, title }) => {
  const { t, i18n } = useTranslation();
  function removeSubstringFromLetterToEnd(str, x) {
    let index = str.indexOf(x);
    return index !== -1 ? str.substring(0, index) : str;
  }
  const getPageComponent = () =>
    pages[0].children.filter(
      (e) =>
        "#" + e.path ==
        removeSubstringFromLetterToEnd(window.location.hash, "?")
    )[0];
  const lookups = useAuth().lookups;
  const userLookups = useAuth().setUserLookUps;
  return (
    lookups != null && (
      <Fragment>
        {/* <div style={{ width: 40, padding: 2, fontSize: 25 }}>
          <i className={"fas fa-repeat"} onClick={() => userLookups()} />
        </div> */}

        <ContentBox i18n={i18n}>
          <div
          // style={{ padding: 10 }}
          >
            {/* <Breadcrumb
              routeSegments={[
                {
                  name: t(
                    category.find((e) => e.Id == getPageComponent().categoryId)
                      .name
                  ),
                },
                { name: t(getPageComponent().name) },
              ]}
            /> */}
          </div>
          <MatxLoading loading={loading} />
          <SimpleCard
          // title={t(getPageComponent()?.name)}
          >
            <form onSubmit={submit}>{children}</form>
          </SimpleCard>
        </ContentBox>
      </Fragment>
    )
  );
};

export default PageLayout;
