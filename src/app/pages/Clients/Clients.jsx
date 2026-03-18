import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DELETE_ORIENTATION, EDIT_ORIENTATION, GET_ORIENTATION } from "./Api";
import { useEffect } from "react";
import { useState } from "react";
import { GET_USERS } from "../Admins/Api";

const Oriantation = () => {
  const { t, i18n } = useTranslation();
  const [sales, setSales] = useState([]);
  useEffect(() => {
    GET_USERS({ pageSize: 1000, pageIndex: 0 })
      .then((res) => {
        setSales(res.Data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "Id",
        captionEn: "Id",
        field: "Id",
        required: false,
        disable: true,
        type: "number",
      },
      {
        caption: "Client Name",
        captionEn: "Client Name",
        field: "ClientName",
        required: true,
        type: "string",
      },
      // {
      //   caption: "Email",
      //   captionEn: "Email",
      //   field: "Email",
      //   required: true,
      //   type: "string",
      // },
      // {
      //   caption: "Phone Number",
      //   captionEn: "Phone Number",
      //   field: "PhoneNumber",
      //   required: true,
      //   type: "string",
      // },
      {
        caption: "Feedback",
        captionEn: "Feedback",
        field: "Feedback",
        required: true,
        type: "string",
      },
      {
        caption: "Is Interested",
        captionEn: "Is Interested",
        field: "IsInterested",
        required: true,
        type: "boolean",
      },
      {
        caption: "Sales",
        captionEn: "Sales",
        field: "SalesId",
        type: "select",
        data: sales, // This will be populated from the API
        value: "Id",
        display: "UserName",
      },
      {
        caption: "Created At",
        captionEn: "Created At",
        field: "CreatedAt",
        required: false,
        type: "datetime",
        disable: true,
      }
    ];
  }, [sales]);

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        view={true}
        GET={GET_ORIENTATION}
        apiKey={"Id"}
      />
    </PageLayout>
  );
};

export default Oriantation;
