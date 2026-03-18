import { Button } from "devextreme-react/button";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
// Components

function ButtonRow({
  submitBehavior = true,
  onUndo,
  loading,
  onSubmit,
  onNew,
  onEdit,
  onCopy,
  onDelete,
  onExit,
  // defineType,
  isSubmit = true,
  isSimilar = true,
  isExit = true,
  isBack = true,
  disableSave,
}) {
  let [flag, setFlag] = useState(true);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    !isBack && setFlag(false);
    return () => {};
  }, []);

  let handleChange = (func, e) => {};

  let isFunction = (functionToCheck) => {
    var getType = {};
    return (
      (functionToCheck &&
        getType.toString.call(functionToCheck) === "[object Function]") ||
      getType.toString.call(functionToCheck) === "[object AsyncFunction]"
    );
  };
  const editBtn = useRef(null);

  // useKeyboardShortcut(['F1'], () => console.log(123), { overrideSystem: true })
  const divCols = "col margin-content";
  return (
    <div className="row" dir="auto">
      {isSubmit && (
        <div className={divCols}>
          <ButtonComponent
            onClick={onSubmit}
            icon={"fas fa-check px-2"}
            title={"Save"}
            loading={loading}
            disabled={!flag || disableSave}
            // useSubmitBehavior={submitBehavior}
            // pressOnEnter
            style={{ margin: 2 }}
          />
        </div>
      )}
      {/* isBack && (
        <div className={divCols}>
          <ButtonComponent
            onClick={(e) =>
              handleChange(isFunction(onUndo) && onUndo("undo", e))
            }
            icon={"fas fa-undo"}
            title={"Back"}
            disabled={!flag}
            style={{ margin: 2 }}
          />
        </div>
      ) */}
      <div className={divCols}>
        <ButtonComponent
          onClick={(e) => handleChange(isFunction(onNew) && onNew("new", e))}
          icon={"fas fa-plus"}
          title={"New"}
          loading={loading}
          //  disabled={flag}
          style={{ margin: 2 }}
        />
      </div>
      <div className={divCols}>
        <ButtonComponent
          onClick={(e) => handleChange(isFunction(onEdit) && onEdit("edit", e))}
          icon={"fas fa-pencil-alt"}
          title={"Edit"}
          //   disabled={flag}
          ref={editBtn}
          loading={loading}
          style={{ margin: 2 }}
        />
      </div>

      {isSimilar && (
        <div className={divCols}>
          <ButtonComponent
            onClick={(e) =>
              handleChange(isFunction(onCopy) && onCopy("copy", e))
            }
            icon={"far fa-copy"}
            title={"Copy"}
            loading={loading}
            //   disabled={flag}
            ref={editBtn}
            style={{ margin: 2 }}
          />
        </div>
      )}
      <div className={divCols}>
        <ButtonComponent
          onClick={(e) =>
            handleChange(isFunction(onDelete) && onDelete("delete", e))
          }
          loading={loading}
          icon={"fas fa-trash-alt"}
          title={"Remove"}
          // disabled={flag}
          ref={editBtn}
          style={{ margin: 20 }}
        />
      </div>

      {isExit && (
        <Button
          className="mx-1 buttonStyle"
          stylingMode="outlined"
          rtlEnabled={true}
          style={{ margin: 2 }}
          onClick={(e) => handleChange(isFunction(onExit) && onExit("exit", e))}
          text={t("Exit")}
          icon="fas fa-sign-out-alt"
        />
      )}
    </div>
  );
}

export default React.memo(ButtonRow);
