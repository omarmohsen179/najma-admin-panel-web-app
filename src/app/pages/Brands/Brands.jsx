import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DELETE_BRAND, EDIT_BRAND, GET_BRANDS } from "./Api";
const Brands = () => {
  const { t, i18n } = useTranslation();
  const INDUSTRY_OPTIONS = {
    PHARMACEUTICALS: 'Pharmaceuticals',
    HEALTHCARE: 'Healthcare (Hospitals / clinic / lab, etc.)',
    ECOMMERCE_RETAIL: 'E-commerce & Retail',
    TECHNOLOGY_SAAS: 'Technology & SaaS',
    EDUCATION_ELEARNING: 'Education & E-learning',
    REAL_ESTATE_CONSTRUCTION: 'Real Estate & Construction',
    HOSPITALITY_TRAVEL: 'Hospitality & Travel',
    FINANCIAL_SERVICES: 'Financial Services',
    CONSULTING_AGENCIES: 'Consulting & Agencies',
    OTHER: 'OTHER'
  };
  const columnAttributes = useMemo(() => {
    return [
      {
        caption: "Product Name",
        captionEn: "Product Name",
        field: "product_name",
        required: true,
      },
      {
        caption: "Brand Market Description",
        captionEn: "Brand Market Description",
        field: "brand_market_description",
        required: true,
      },
      {
        caption: "Industry",
        captionEn: "Industry",
        field: "industry",
        required: true,
        data: Object.entries(INDUSTRY_OPTIONS).map(([key, value]) => ({ Id: value, CategoryName: value })),
        value: "Id",
        display: "CategoryName",
      },
      {
        caption: "Engagement Objectives",
        captionEn: "Engagement Objectives",
        field: "engagement_objectives",
        required: true,
      },
      {
        caption: "Brand Life Cycle",
        captionEn: "Brand Life Cycle",
        field: "brand_life_cycle",
        required: true,
      },
      {
        caption: "Market Strengths",
        captionEn: "Market Strengths",
        field: "market_strengths",
        required: true,
      },
      {
        caption: "First Message",
        captionEn: "First Message",
        field: "first_message",
        required: true,
      },
      {
        caption: "Second Message",
        captionEn: "Second Message",
        field: "second_message",
        required: false,
      },
      {
        caption: "Third Message",
        captionEn: "Third Message",
        field: "third_message",
        required: false,
      },
      {
        caption: "First Segment Description",
        captionEn: "First Segment Description",
        field: "first_segment_description",
        required: true,
      },
      {
        caption: "Second Segment Description",
        captionEn: "Second Segment Description",
        field: "second_segment_description",
        required: false,
      },
      {
        caption: "Third Segment Description",
        captionEn: "Third Segment Description",
        field: "third_segment_description",
        required: false,
      },
    ];
  }, []);

  return (
    <PageLayout>
      <CrudMUI
        id={"Id"}
        colAttributes={columnAttributes}
        EDIT={EDIT_BRAND}
        ADD={EDIT_BRAND}
        DELETE={DELETE_BRAND}
        GET={GET_BRANDS}
        apiKey={"id"}
      />
    </PageLayout>
  );
};

export default Brands;
