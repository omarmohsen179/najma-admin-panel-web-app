import { memo, useState } from "react";
// import useCollapse from "react-collapsed";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import "./CollapsibleElement.css";
import { Collapse, NavItem } from "reactstrap";

// "fas fa-filter "
const CollapsibleElement = ({
  children,
  iconFontSize = 20,
  icon,
  title,
  Component,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggle = () => setCollapsed(!collapsed);
  const { t, i18n } = useTranslation();

  return (
    <div>
      <label
        onClick={toggle}
        className={classNames({ "menu-open": !collapsed })}
        style={{ display: "flex" }}
      >
        <div style={{ width: "25px" }}>
          <i
            style={{ fontSize: 14, padding: 5 }}
            className={
              !collapsed
                ? "fas fa-angle-down"
                : i18n.language == "en"
                ? "fas fa-angle-right"
                : "fas fa-angle-left"
            }
          ></i>
        </div>

        {Component && (
          <div style={{ width: "80%" }}>
            <Component />
          </div>
        )}
        {icon && (
          <i
            style={{ fontSize: iconFontSize, padding: 5 }}
            className={icon}
          ></i>
        )}
        {title && <b style={{ padding: 5 }}>{title}</b>}
      </label>
      <Collapse
        isOpen={!collapsed}
        navbar
        className={classNames("items-menu", { "mb-1": !collapsed })}
      >
        {children}{" "}
      </Collapse>
    </div>
  );
};

export default memo(CollapsibleElement);
