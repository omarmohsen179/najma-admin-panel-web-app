import React from "react";
import { useTranslation } from "react-i18next";
import Select, { components } from "react-select";
import withLabel from "../components/Inputs/withLabel";
const { Option, MultiValue } = components;

function SelectionPopUp({
  values,
  onSelectionChange,
  columnAttributes,
  button_title,
  dataLabel,
  disabled,
  dataSource,
  valueKey = "Id",
  label,
  selectionMode = "multiple",
}) {
  const { t } = useTranslation();
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: 40,
    }),
    option: (provided) => ({
      ...provided,
      minHeight: 40,
      display: "flex",
      alignItems: "center",
    }),
  };
  const isAllOptionSelected = dataSource?.length == values?.length;

  function handleChange(xxx) {
    var selectedIds = xxx
      .filter((e) => !e.isAllOption)
      .map((option) => option[valueKey]);
    if (xxx.filter((e) => e.isAllOption).length > 0) {
      selectedIds = dataSource.map((option) => option[valueKey]);
      onSelectionChange(isAllOptionSelected ? [] : selectedIds);
    } else {
      onSelectionChange(selectedIds);
    }
  }

  const CheckboxOption = (props) => {
    const { data, isSelected, onChange } = props;

    return (
      <Option {...props}>
        <input
          type="checkbox"
          checked={isSelected || isAllOptionSelected}
          onChange={() => onChange && onChange(data)}
        />
        <label style={{ textAlign: "center", alignSelf: "center", padding: 5 }}>
          {data[dataLabel]}
        </label>
      </Option>
    );
  };

  // To set the id of the selected row in it to enable deleting or editing on clicking ok.
  return (
    <div>
      <Select
        isMulti
        options={[
          {
            [dataLabel]: "Select All",
            [valueKey]: "select_all",
            isAllOption: true,
          },
          ...dataSource,
        ]}
        value={dataSource.filter((option) =>
          values?.includes(option[valueKey])
        )}
        onChange={handleChange}
        getOptionLabel={(option) => option[dataLabel]}
        getOptionValue={(option) => option[valueKey]}
        placeholder={t(label)}
        styles={customStyles}
        isDisabled={disabled}
        components={{
          Option: CheckboxOption,
        }}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        onInputChange={() => {}}
        onMenuClose={() => {}}
        onMenuOpen={() => {}}
        onMenuScrollToBottom={() => {}}
        onMenuScrollToTop={() => {}}
        onValueClick={() => {}}
        onMenuKeyDown={() => {}}
        // isOptionSelected={(option) =>
        //   isAllOptionSelected || values.includes(option[valueKey])
        // }
      />
    </div>
  );
}

export default withLabel(SelectionPopUp);
