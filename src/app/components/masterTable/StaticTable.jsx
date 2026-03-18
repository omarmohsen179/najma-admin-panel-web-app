import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import "jspdf-autotable";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DisplayText from "../DisplayText/DisplayText";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

function StaticTable({
  id = "Id",
  dataSource,
  colAttributes,
  onDelete,
  onEdit,
  canEdit,
  canDelete,
  handleRowDoubleClick,
  maxHeight = "500px",
  onSubmit,
}) {
  const { t, i18n } = useTranslation();
  const handleEdit = (row) => {
    setSelectedRow(row);
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleDelete = (row) => {
    if (onDelete) {
      onDelete(row);
    }
  };
  const [selectedRow, setSelectedRow] = useState(null);
  const tableRef = useRef(null);
  useEffect(() => {
    if (tableRef.current) {
      const tableWidth = tableRef.current.offsetWidth;
      const columnCount = colAttributes.length;
      const avgColumnWidth = tableWidth / columnCount;

      colAttributes.forEach((column, index) => {
        const cells = Array.from(
          tableRef.current.querySelectorAll(`[data-column="${index}"]`)
        );
        const maxWidth = cells.reduce(
          (max, cell) => Math.max(max, cell.offsetWidth),
          0
        );
        const newWidth = Math.min(maxWidth, avgColumnWidth);
        cells.forEach((cell) => {
          cell.style.width = `${newWidth}px`;
        });
      });
    }
  }, [dataSource, colAttributes]);
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
  const [filteredData, setFilteredData] = useState(dataSource);
  const [searchInput, setSearchInput] = useState({});
  useEffect(() => {
    setFilteredData(dataSource);
  }, [dataSource]);
  function filterObjects(inputObject, arrayOfObjects) {
    return arrayOfObjects.filter(function (object) {
      // Check if all key-value pairs in the input  object
      // are present in the current object of the array

      return Object.keys(inputObject).every(function (key) {
        return (
          object[key]?.toString()?.toLowerCase()?.includes(inputObject[key]) ||
          inputObject[key]?.toString()?.toLowerCase()?.includes(object[key]) ||
          !inputObject[key]
        );
      });
    });
  }
  // useEffect(() => {
  //   console.log(searchInput);
  //   setFilteredData(filterObjects(searchInput, dataSource));
  // }, [searchInput]);
  const handleSearch = (event, column) => {
    const value = event.target.value.toLowerCase();

    setSearchInput((prev) => ({ ...prev, [column.field]: value }));
  };

  const handleChange = useCallback(
    (index, { name, value }) => {
      setFilteredData(
        filteredData.map((ele, i) =>
          ele[id] == index[id] ? { ...ele, [name]: value } : ele
        )
      );
    },
    [filteredData]
  );
  const handleChangeRow = (row) => {
    setFilteredData(
      filteredData.map((ele, i) => (row.Id == ele.Id ? row : ele))
    );
  };

  // const [YesOrNo, setYesOrNo] = useState({ id: 0, state: false, data: null });
  return (
    <>
      {/* <YesOrNoPopUp
        dailog={YesOrNo.state}
        setdialog={(e) => setYesOrNo({ id: 0, state: e, data: null })}
        onEdit={() =>c}
      /> */}

      <Paper sx={{ width: "100%", overflow: "hidden", zIndex: 0 }}>
        <TableContainer sx={{ maxHeight: maxHeight }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {(canDelete || canEdit) && (
                  <TableCell
                    align="center"
                    style={{ width: "100px" }}
                  ></TableCell>
                )}
                {colAttributes.map((column, index) => (
                  <TableCell
                    align="center"
                    key={column.field}
                    style={{ width: "150px", fontSize: 15, fontWeight: "bold" }}
                  >
                    {i18n.language == "ar" ? column.caption : column.captionEn}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData &&
                filteredData.map((row, index) => (
                  <TableRow
                    key={index}
                    //  selected={selectedRow && selectedRow.Id === row.Id}
                    onDoubleClick={() =>
                      handleRowDoubleClick != null && handleRowDoubleClick(row)
                    }
                    className={
                      handleRowDoubleClick != null && "MuiTableRow-hover"
                    }
                    style={{
                      cursor: handleRowDoubleClick != null && "pointer",
                    }}
                  >
                    {(canDelete || canEdit) && (
                      <TableCell>
                        {canEdit && (
                          <IconButton onClick={() => handleEdit(row)}>
                            <EditIcon />
                          </IconButton>
                        )}
                        {canDelete && (
                          <IconButton
                            onClick={() => {
                              handleDelete(row);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    )}
                    {colAttributes.map((column) => (
                      <TableCell align="center" key={column.field}>
                        {column.customizeText != null ? (
                          <column.customizeText
                            value={displayValue(column, row)}
                            data={row}
                            handleChangeRow={handleChangeRow}
                            handleChange={handleChange}
                            index={index}
                            column={column}
                          />
                        ) : (
                          <>
                            <DisplayText
                              type={column.type ? column.type : "number"}
                              value={displayValue(column, row)}
                            />
                          </>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {onSubmit != null && (
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ padding: 2, width: "100%" }}>
            <ButtonComponent
              icon="fas fa-plus"
              title={"Save"}
              type="button"
              onClick={() => onSubmit(filteredData)}
              disabled={
                JSON.stringify(filteredData) == JSON.stringify(dataSource)
              }
            />
          </div>
          <div style={{ padding: 2, width: "100%" }}>
            <ButtonComponent
              // icon="fas fa-plus"
              title={"Reset"}
              type="button"
              onClick={() => setFilteredData(dataSource)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default React.memo(StaticTable);
