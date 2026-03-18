import { useMemo } from "react";

import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";

import { DELETE_BROKER, EDIT_BROKER, GET_BROKERS } from "./Api";

const Brokers = () => {
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "Id",
        captionEn: "Id",
        field: "Id",
        disable: true,
        isVisable: false,
      },
      {
        caption: "Name",
        captionEn: "Name",
        field: "Name",
        required: true,
      },
      {
        caption: "Phone Number",
        captionEn: "Phone Number",
        field: "PhoneNumber",
      },
      {
        caption: "Email",
        captionEn: "Email",
        field: "Email",
        type: "email",
      },
      {
        caption: "Created At",
        captionEn: "Created At",
        field: "CreatedAt",
        type: "datetime",
        disable: true,
      },
      {
        caption: "Updated At",
        captionEn: "Updated At",
        field: "UpdatedAt",
        type: "datetime",
        disable: true,
      },
    ];
  }, []);

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        EDIT={EDIT_BROKER}
        ADD={EDIT_BROKER}
        DELETE={DELETE_BROKER}
        GET={GET_BROKERS}
        apiKey={"Id"}
      />
    </PageLayout>
  );
};

export default Brokers;

