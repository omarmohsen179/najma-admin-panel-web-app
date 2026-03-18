import React, { useCallback, useRef } from "react";
// import Accordion from "devextreme-react/accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

function CollapsibleList({
  data,
  ItemRender,
  passedData = {},
  Title = "Title",
  secondColor = false,
}) {
  const [expanded, setExpanded] = React.useState(-1);

  const handleChange = useCallback((panel) => {
    setExpanded(panel);
  }, []);
  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      style={{ backgroundColor: secondColor && "#5cb85c" }}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  return (
    <div style={{ maxWidth: "100%" }}>
      {data != null &&
        data.length > 0 &&
        data?.map((ele, i) => {
          return (
            <Accordion
              expanded={expanded == i}
              onChange={() => handleChange(expanded == i ? -1 : i)}
            >
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>{ele[Title]?.toString()}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <ItemRender data={ele} index={i} {...passedData} />
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      {/* <Accordion
        dataSource={data}
        collapsible={false}
        multiple={false}
        animationDuration={300}
        //   selectedItems={selectedItems}
        //   onSelectionChanged={this.selectionChanged}
        itemTitleRender={TitleCom}
        itemRender={itemRender}
        style={{ margin: 5 }}
        id="accordion-container"
      /> */}
    </div>
  );
}
export default React.memo(CollapsibleList);
