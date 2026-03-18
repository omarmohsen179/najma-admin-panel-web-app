import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DELETE_CATEGORY, EDIT_CATEGORY, GET_CATEGORIES } from "./Api";
import { useEffect } from "react";
import { useState } from "react";
import { GET_BRANDS } from "../Brands/Api";
import useAuth from "app/hooks/useAuth";
const Contents = () => {
  const { t, i18n } = useTranslation();
  const [brands, setBrands] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    GET_BRANDS({ pageSize: 1000, pageIndex: 0, userId: user.user.id })
      .then((res) => {
        setBrands(res.Data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "الاسم",
        field: "content_name",
        captionEn: "Content Name",
        required: true,
      },
      {
        caption: "الوصف",
        field: "content_description",
        captionEn: "Description",
        required: true,
      },
      {
        caption: "الأهداف الرئيسية",
        field: "key_objectives",
        captionEn: "Key Objectives",
        required: true,
      },
      {
        caption: "Brand",
        field: "brand_id",
        captionEn: "Brand",
        required: true,
        data: brands,
        value: "id",
        display: "product_name",
      },
      {
        caption: "القناة",
        field: "channel",
        captionEn: "Channel",
        required: true,
      },
      {
        caption: "نغمة المحتوى",
        field: "content_tune",
        captionEn: "Content Tune",
        required: true,
      },
      {
        caption: "نسخة المحتوى",
        field: "content_copy",
        captionEn: "Content Copy",
        required: true,
      },
    ];
  }, []);

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        EDIT={EDIT_CATEGORY}
        ADD={EDIT_CATEGORY}
        DELETE={DELETE_CATEGORY}
        GET={GET_CATEGORIES}
        apiKey={"id"}
      />
    </PageLayout>
  );
};

export default Contents;
