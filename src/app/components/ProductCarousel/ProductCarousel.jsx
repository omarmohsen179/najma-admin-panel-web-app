import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { useCallback } from "react";
const ProductCarousel = ({
  pageSize,
  api,
  FilterForm,
  defaultData,
  ListCard,
  onElementClick,
  ...passToCard
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [values, setValues] = useState({
    ...defaultData,
  });
  useEffect(() => {
    setValues({
      ...defaultData,
    });
  }, [defaultData]);
  useEffect(() => {
    fetchProducts(pageNumber);
  }, [pageNumber]);

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      //  setProducts([]);
      api({ ...values, PageIndex: page, PageSize: pageSize })
        .then((res) => {
          setProducts(res.Data);
        })
        .finally((e) => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePrevPage = () => {
    setPageNumber((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setPageNumber((prevPage) => prevPage + 1);
  };
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const Change = useCallback(({ name, value }) => {
    setValues((prev) => ({
      ...prev,

      [name]: value,
    }));
  }, []);
  return (
    <div style={{ direction: "ltr" }}>
      {FilterForm && (
        <div style={{ padding: "10px" }}>
          <FilterForm values={values} Change={Change} />
          <div className="col-lg-4 col-md-6 col-sm-12">
            <ButtonComponent
              title={"Filter"}
              type="button"
              loading={loading}
              onClick={() => fetchProducts(1)}
            />
          </div>
        </div>
      )}
      <div style={{ width: "100%" }}>
        <Box
          display="flex"
          overflow="auto"
          flexDirection={isSmallScreen ? "column" : "row"}
          alignItems={isSmallScreen ? "center" : "flex-start"}
          minHeight={300}
          // minWidth={"100%"}
        >
          <IconButton
            onClick={handlePrevPage}
            disabled={pageNumber === 1}
            style={{ alignSelf: "center" }}
          >
            <ArrowBackIcon />
          </IconButton>
          {products.map((product, index) => (
            <ListCard data={product} onClick={onElementClick} {...passToCard} />
          ))}
          <IconButton onClick={handleNextPage} style={{ alignSelf: "center" }}>
            <ArrowForwardIcon />
          </IconButton>
        </Box>{" "}
      </div>
    </div>
  );
};

export default ProductCarousel;
