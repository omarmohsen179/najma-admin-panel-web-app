// import MaterialTable, { MTableToolbar } from "material-table";
// import { Divider, Grid, TableCell, Typography } from "@material-ui/core";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateConvertor } from "../DateFunction";
import fonts from "./Janna.ttf";
import "./Table.css";
function InputTableEdit({
  id = "",
  dataSource,
  colAttributes,
  onDelete,
  onEdit,
  canEdit,
  canDelete,
  title = "file",
}) {
  const { t, i18n } = useTranslation();
  const handleEdit = (row) => {
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = (row) => {
    if (onDelete) {
      onDelete(row);
    }
  };
  const displayData = (data) =>
    data.map((row) => {
      var real = {};
      return colAttributes
        .filter((e) => !e.notPdf && e.customizeText == null)
        .map((column) =>
          column.data != null
            ? column.data.find(
                (e) => e[column["value"]] == row[column["field"]]
              )
              ? column.data.find(
                  (e) => e[column["value"]] == row[column["field"]]
                )[column["display"]]
              : ""
            : row[column["field"]]
        );
    });
  const displayDataExcel = (data) =>
    data.map((row) => {
      var real = {};
      colAttributes
        .filter((e) => !e.notPdf && e.customizeText == null)
        .map((column) => {
          real = {
            ...real,
            [column["field"]]:
              column.data != null
                ? column.data.find(
                    (e) => e[column["value"]] == row[column["field"]]
                  )
                  ? column.data.find(
                      (e) => e[column["value"]] == row[column["field"]]
                    )[column["display"]]
                  : ""
                : row[column["field"]],
          };
          return null;
        });
      return real;
    });
  function printDocument(data) {
    const doc = new jsPDF("l", "mm", "a4");
    doc.addFont(fonts, "Arimo", "normal");
    doc.setFont("Arimo", "normal");
    autoTable(doc, {
      head: [
        colAttributes
          .filter((e) => !e.notPdf && e.customizeText == null)
          .map((col) => col.caption),
      ],
      body: displayData(data),
      headStyles: { font: "Arimo", fontStyle: "normal", align: "right" },
      styles: { font: "Arimo", fontStyle: "normal", align: "right" },
      startY: 40,
    });

    doc.save(title + ".pdf");
  }
  const Toolbar = (props) => {
    // return (
    //   <div>
    //     <MTableToolbar {...props} />
    //     <Grid align="right" style={{ padding: 2 }}>
    //       <Typography variant="subtitle2">
    //         {/* Number of rows : {props.data.length} */}
    //         <IconButton onClick={onRefresh}>
    //           <RefreshIcon />
    //         </IconButton>
    //         <IconButton onClick={() => printDocument(props.data)}>
    //           <PrintIcon />
    //         </IconButton>
    //         {excel ? (
    //           <IconButton>
    //             <CSVLink
    //               headers={colAttributes
    //                 .filter((e) => !e.notPdf && e.customizeText == null)
    //                 .map((e) => ({
    //                   label: e.caption,
    //                   key: e.field,
    //                 }))}
    //               data={displayDataExcel(props.data)}
    //               style={{
    //                 fontSize: 13,
    //               }}
    //               filename={title + ".csv"}
    //             >
    //               <TabOutlined />
    //             </CSVLink>
    //           </IconButton>
    //         ) : null}
    //       </Typography>
    //     </Grid>
    //     <Divider />
    //   </div>
    // );
  };
  // const displayValue = (col, row) => {
  //   try {
  //     return col.data != null
  //       ? col.data?.find((e) => e[col.value] == row[col.field])[
  //           i18n.language == "en" && col.displayEn ? col.displayEn : col.display
  //         ]
  //       : row[col.field];
  //   } catch {
  //     return "";
  //   }
  // };
  const [filteredData, setFilteredData] = useState([]);

  const handleChange = useCallback(
    (row, { name, value }) => {
      setFilteredData(
        filteredData.map((ele, i) =>
          row.Id == ele.Id ? { ...ele, [name]: value } : ele
        )
      );
    },
    [filteredData]
  );
  const displayValue = (col, row) => {
    try {
      return col.data != null
        ? col.data?.find((e) => e[col.value] == row[col.field])[
            i18n.language == "en" && col.displayEn ? col.displayEn : col.display
          ]
        : row[col.field];
    } catch {
      return "";
    }
  };
  const [cols, setCols] = useState([]);
  useEffect(() => {
    setCols(applyColumns());
  }, [colAttributes, i18n.language, dataSource]);
  const applyColumns = () => {
    const res = [];
    // if (canDelete || canEdit) {
    //   res.push({
    //     title: "test",
    //     field: "test",
    //     cellStyle: {
    //       textAlign: "center",
    //     },
    //     headerStyle: {
    //       textAlign: "center",
    //     },

    //     render: (row) => <CustumCrudButtons row={row} />,
    //   });
    // }

    res.push(
      ...colAttributes.map((column) => ({
        title: i18n.language == "ar" ? column.caption : column.captionEn,
        field: column.field.toString(),
        type: column.type,
        cellStyle: {
          textAlign: "center",
          // minWidth: column.width ?? "150px",
          // width: column.width ?? "150px",
        },
        headerStyle: {
          textAlign: "center",
          // minWidth: column.width ?? "150px",
          // width: column.width ?? "150px",
        },
        lookup: column.data ? convertArrayToObject(column.data, column) : null,
        render: column.customizeText
          ? (row, index) => (
              <column.customizeText
                value={displayValue(column, row)}
                data={row}
                handleChange={handleChange}
                handleChangeRow={(row) => {
                  setFilteredData(
                    filteredData.map((ele, i) => (row.Id == ele.Id ? row : ele))
                  );
                }}
                index={index}
                column={column}
              />
            )
          : column.type == "date"
          ? (rowData) => DateConvertor(rowData[column.field.toString()], i18n)
          : null,
      }))
    );

    return res;
  };
  function convertArrayToObject(array, col) {
    const res = array.reduce((obj, item) => {
      obj[item[col.value]] = item[col.display];
      return obj;
    }, {});
    return res;
  }
  const setData = () => setFilteredData(dataSource);
  useEffect(() => {
    setData();
  }, [dataSource]);
  const actions = () => {
    var res = [];
    if (canDelete) {
      res.push({
        icon: "delete",
        tooltip: "delete",
        onClick: (row, rowData) => {
          handleDelete(rowData);
        },
      });
    }
    if (canEdit) {
      res.push({
        icon: "edit",
        tooltip: "Edit",

        onClick: (row, rowData) => {
          handleEdit(rowData);
        },
      });
    }
    return res;
  };
  // const renderHeaderCell = (column) => (
  //   <TableCell
  //     //colSpan={column.subColumns ? column.subColumns.length : 1}
  //     style={{ backgroundColor: "#f2f2f2" }}
  //   ></TableCell>
  // );

  // const [YesOrNo, setYesOrNo] = useState({ id: 0, state: false, data: null });
  return (
    <>
      {/* <MaterialTable
        data={filteredData}
        columns={cols}
        isLoading={loading}
        components={{
          Toolbar,
        }}
        options={{
          pageSize: pageSize && pageSize,
          columnsButton: true,
          // filtering: true,
          //   showTitle: false,
          // grouping: true,
          //  maxBodyHeight: "500px",
          thirdSortClick: false,
          headerStyle: {
            position: "sticky",
            top: "0",
          },
          rowStyle: getRowStyle,
          // Set the default page size
          pageSizeOptions: [10, 20, 50], // Set the available page size options
        }}
        onRowClick={(event, row) =>
          handleRowDoubleClick != null && handleRowDoubleClick(row)
        }
        actions={actions()}
      /> */}
    </>
  );
}

export default React.memo(InputTableEdit);
