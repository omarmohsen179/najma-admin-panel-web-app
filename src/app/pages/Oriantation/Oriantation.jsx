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
        caption: "First Name",
        captionEn: "First Name",
        field: "FirstName",
        required: true,
        type: "string",
      },
      {
        caption: "Last Name",
        captionEn: "Last Name",
        field: "LastName",
        required: true,
        type: "string",
      },
      {
        caption: "Email",
        captionEn: "Email",
        field: "Email",
        required: true,
        type: "string",
      },
      {
        caption: "Phone Number",
        captionEn: "Phone Number",
        field: "PhoneNumber",
        required: true,
        type: "string",
      },
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
        data: sales,
        value: "Id",
        display: "UserName",
      },
      {
        caption: "Location",
        captionEn: "Location",
        field: "Location",
        required: false,
        type: "string",
      },
      {
        caption: "Created At",
        captionEn: "Created At",
        field: "CreatedAt",
        required: false,
        type: "datetime",
        disable: true,
      },
      // {
      //   caption: "Updated At",
      //   captionEn: "Updated At",
      //   field: "UpdatedAt",
      //   required: false,
      //   type: "datetime",
      //   disable: true,
      // }
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
