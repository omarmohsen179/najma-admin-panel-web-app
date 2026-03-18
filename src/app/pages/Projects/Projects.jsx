import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DELETE_PROJECT, EDIT_PROJECT, GET_PROJECTS } from "./Api";

const Projects = () => {
  const { t, i18n } = useTranslation();
  
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "Id",
        captionEn: "Id",
        field: "Id",
        required: false,
        disable: true,
      },
      {
        caption: "Name",
        captionEn: "Name",
        field: "Name",
        required: true,
      },
      {
        caption: "Description",
        captionEn: "Description",
        field: "Description",
        required: false,
      },
      {
        caption: "Address",
        captionEn: "Address",
        field: "Address",
        required: true,
      },
      {
        caption: "Latitude",
        captionEn: "Latitude",
        field: "Latitude",
        required: true,
        type: "number",
      },
      {
        caption: "Longitude",
        captionEn: "Longitude",
        field: "Longitude",
        required: true,
        type: "number",
      },
      {
        caption: "Total Units",
        captionEn: "Total Units",
        field: "TotalUnits",
        required: true,
        type: "number",
      },
      // {
      //   caption: "Amenities",
      //   captionEn: "Amenities",
      //   field: "Amenities",
      //   required: false,
      //   type: "array",
      // },
      {
        caption: "Created At",
        captionEn: "Created At",
        field: "CreatedAt",
        required: false,
        type: "datetime",
        
        disable: true,
      },
      {
        caption: "Updated At",
        captionEn: "Updated At",
        field: "UpdatedAt",
        required: false,
        type: "datetime",
        disable: true,
      }
    ];
  }, []);

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        EDIT={EDIT_PROJECT}
        ADD={EDIT_PROJECT}
        DELETE={DELETE_PROJECT}
        GET={GET_PROJECTS}
        apiKey={"Id"}
      />
    </PageLayout>
  );
};

export default Projects;
