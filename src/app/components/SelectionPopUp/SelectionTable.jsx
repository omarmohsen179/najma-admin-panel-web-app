import React, { useCallback } from "react";
import MasterTable from "../masterTable/MasterTable";

const SelectionTable = ({
  data,
  columnAttributes,
  selectionMode,
  values,
  onSelectionChange,
  valueKey,
}) => {
  const onChange = useCallback(
    (e) => {
      onSelectionChange(
        (e.selectedRowKeys.length &&
          e.selectedRowKeys.map((e) => (valueKey ? e[valueKey] : e))) ||
          []
      );
    },
    [onSelectionChange]
  );
  return (
    <div>
      <MasterTable
        dataSource={data}
        keyExpr={valueKey}
        colAttributes={columnAttributes}
        filterRow
        //  onRowDoubleClick={handleDoubleClick}
        height={"400px"}
        columnChooser={true}
        selectionMode={selectionMode}
        allowSelectAllMode="allPages"
        showCheckBoxesMode="always"
        allowDelete={false}
        onSelectionChanged={onChange}
        selectedRowKeys={values}
      />
    </div>
  );
};
export default React.memo(SelectionTable);
