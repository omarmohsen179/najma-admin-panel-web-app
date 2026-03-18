import CrudMUI from "app/components/CrudTable/CrudMUI";
import PageLayout from "app/components/PageLayout/PageLayout";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DELETE_CUSTOMER, EDIT_CUSTOMER, GET_CUSTOMERS } from "./Api";
import { GET_BRANDS } from "../Brands/Api";
import useAuth from "app/hooks/useAuth";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
const Customers = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [countryCodes, setCountryCodes] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {

    axios.get('https://countriesnow.space/api/v0.1/countries/codes')
      .then(response => {
        console.log(response.data.data);
        const countries = response.data.data.map(country => ({
          name: country.name,
          code: `+${country.dial_code}`,
        })).filter(c => c.code !== null).sort((a, b) => a.name.localeCompare(b.name));
        console.log(countries)
        setCountryCodes(countries);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
      });
    GET_BRANDS({ pageSize: 1000, pageIndex: 0, userId: user.user.id })
      .then((res) => {
        console.log(res);
        setBrands(res.Data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const columnAttributes = useMemo(() => {
    return [
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
        caption: "Full Name",
        field: "full_name",
        captionEn: "Full Name",
        required: true,
      },
      {
        caption: "Email",
        field: "email",
        captionEn: "Email",
        required: true,
      },
      {
        caption: "Telephone",
        field: "telephone",
        captionEn: "Telephone",
        type: "number",
        required: false,
      },
      {
        caption: "WhatsApp",
        field: "whatsapp",
        captionEn: "WhatsApp",
        type: "number",
        required: false,
      },
      {
        caption: "Country Code",
        field: "country_code",
        captionEn: "Country Code",
        required: false,
        data: countryCodes,
        value: "code",
        display: "name",
      },
      {
        caption: "Communication Frequency",
        field: "communication_frequency",
        captionEn: "Communication Frequency",
        type: "number",
        required: false,
      },
      {
        caption: "Engagement Objectives",
        field: "engagement_objectives",
        captionEn: "Engagement Objectives",
        required: false,
      },
      {
        caption: "Preferred Channels",
        field: "preferred_channels",
        captionEn: "Preferred Channels",
        required: false,
      },
      {
        caption: "Customer Category",
        field: "customer_category",
        captionEn: "Customer Category",
        required: false,
      },
      {
        caption: "Customer Persona",
        field: "customer_persona",
        captionEn: "Customer Persona",
        required: false,
      },
    ];
  }, [brands, countryCodes]);

  return (
    <PageLayout>
      <CrudMUI
        id={"user_id"}
        apiKey={"id"}
        colAttributes={columnAttributes}
        EDIT={EDIT_CUSTOMER}
        ADD={EDIT_CUSTOMER}
        DELETE={DELETE_CUSTOMER}
        GET={GET_CUSTOMERS}
      />
    </PageLayout>
  );
};

export default Customers;
