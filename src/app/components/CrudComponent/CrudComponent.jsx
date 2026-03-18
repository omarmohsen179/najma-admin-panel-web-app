import { styled } from "@mui/material";
import useAuth from "app/hooks/useAuth";
import notify from "devextreme/ui/notify";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EditDelete1 from "../../components/EditDelete1";
import ButtonsRow from "../../components/components/ButtonsRow";
import Loading from "../MatxLoading";
import PageLayout from "../PageLayout/PageLayout";

const CrudComponent = ({
  columnAttributes,
  defaultData,
  DELETE,
  EDIT,
  GET,
  GET_BY_ID,
  Form,
  pagination = false,
  validation = () => false,
  selectedItem = 0,
  copy = false,
}) => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [data, setData] = useState([]);
  const [oldValues, setOldValues] = useState([]);
  const [action, setAction] = useState(false);

  const [values, setValues] = useState(defaultData.current);
  const handleChange = useCallback(({ name, value }) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);
  const [editDeleteStatus, setEditDeleteStatus] = useState("");

  const onUndo = useCallback(() => {
    setValues({ ...defaultData.current });
  }, []);

  const submit = useCallback(
    (e) => {
      // e?.preventDefault();

      const valid = validation(values);

      if (valid) {
        notify(
          {
            message: t(valid),
            width: 600,
          },
          "error",
          3000
        );
        return;
      }

      setLoading(true);

      EDIT(values)
        .then((res) => {
          notify(t("saved successfully"), "success", 3000);
          setValues(res);
          setOldValues(res);
        })
        .catch((err) => {
          console.log(err);
          notify(
            t(err ? err : "Error in information. try again!"),
            "error",
            3000
          );
        })
        .finally(() => setLoading(false));
    },
    [values, t, EDIT, validation]
  );

  const onUpdateDelete = useCallback(
    (title) => {
      setAction(true);
      setValues({
        ...defaultData.current,
      });
      setOldValues({
        ...defaultData.current,
      });
      if (!pagination) {
        setLoading(true);

        GET()
          .then((e) => {
            setEditDeleteStatus(title);
            setData(e);
            setPopUp(true);
          })
          .catch(() => {})
          .finally(() => {
            setAction(false);
            setLoading(false);
          });
      } else {
        setPopUp(true);
        setAction(false);
      }
    },
    [defaultData]
  );
  const onNew = useCallback(() => {
    setValues({
      ...defaultData.current,
    });
    setOldValues({
      ...defaultData.current,
    });
  }, []);

  const ClosePopUp = useCallback((id) => {
    setPopUp(false);
  }, []);

  const removeElement = useCallback((id) => {
    setData((prev) => [...prev.filter((e) => e.Id != id)]);
  }, []);
  const handleGetImages = (event) => {
    let files = event.target.files;

    setValues((prev) => ({ ...prev, Image: files[0], ImagePath: "" }));
  };

  const handleRemoveImage = useCallback(() => {
    setValues((prev) => ({ ...prev, Image: "", ImagePath: "" }));
  }, []);
  const setElementData = useCallback(
    (e, cpy = false) => {
      setValues({
        ...defaultData.current,
      });
      setOldValues({
        ...defaultData.current,
      });
      if (GET_BY_ID) {
        setLoading(true);
        GET_BY_ID(e.Id)
          .then((res) => {
            setValues({ ...res, Id: cpy ? 0 : res.Id, Copy: cpy });
            setOldValues(res);
          })
          .catch((e) => {
            notify(
              {
                message: t("this item already in this category"),
                width: 600,
              },
              "error",
              3000
            );
          })
          .finally(() => setLoading(false));
      } else {
        setValues({ ...e, Id: cpy ? 0 : e.Id, Copy: cpy });
        setOldValues({ ...e, Copy: cpy });
      }
    },
    [GET_BY_ID]
  );

  useEffect(() => {
    if (selectedItem > 0) {
      setLoading(true);
      GET()
        .then((e) => {
          setElementData(
            e.filter((e) => e.Id == selectedItem)[0],
            copy == "false" ? false : true
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      onNew();
    }
  }, [selectedItem]);

  const handleChangeObj = useCallback((obj) => {
    setValues((prev) => ({
      ...prev,
      ...obj,
    }));
  }, []);

  const lookups = useAuth().lookups;
  return (
    lookups != null && (
      <PageLayout>
        <>
          <Loading loading={loading} />
          {!action && (
            <div className="row">
              <Form
                handleChange={handleChange}
                values={values}
                handleChangeObj={handleChangeObj}
                handleGetImages={handleGetImages}
                handleRemoveImage={handleRemoveImage}
                setLoading={setLoading}
                savedValues={oldValues}
              />
            </div>
          )}

          <ButtonsRow
            onNew={onNew}
            onCopy={null}
            onEdit={onUpdateDelete}
            onDelete={onUpdateDelete}
            loading={loading}
            isSimilar={false}
            onUndo={onUndo}
            isExit={false}
            onSubmit={submit}
            disableSave={JSON.stringify(values) == JSON.stringify(oldValues)}
          />

          <EditDelete1
            data={data}
            columnAttributes={columnAttributes}
            deleteItem={DELETE}
            removeElement={removeElement}
            close={ClosePopUp}
            getEditData={setElementData}
            visible={popUp}
            editDeleteStatus={editDeleteStatus}
            pagination={pagination}
            GET={GET}
            DELETE={DELETE}
            remoteOperations
            selectedRowKeys
          />
        </>
      </PageLayout>
    )
  );
};

export default memo(CrudComponent);
