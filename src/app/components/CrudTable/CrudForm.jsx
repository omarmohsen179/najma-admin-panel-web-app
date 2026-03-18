import React, { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "../Dialog/Dialog";

function CrudForm({
  data,
  handleChange,
  ElementForm,
  setLoading,
  setPopupStatus,
  title,
  loading,
  status,
  FormData,
  Submit,
}) {
  const { t, i18n } = useTranslation();

  let handleGetImages = useCallback(
    (event) => {
      let files = event.target.files;
      handleChange({ name: "Image", value: files[0] });
      handleChange({ name: "ImagePath", value: "" });
    },
    [handleChange]
  );
  let handleRemoveImage = useCallback(() => {
    handleChange({ name: "Image", value: "" });
    handleChange({ name: "ImagePath", value: "" });
  }, [handleChange]);

  return (
    <Dialog
      close={() => setPopupStatus(false)}
      title={t(title)}
      loading={loading}
      visible={status}
      Submit={Submit}
      width={800}
      full
    >
      {status && (
        <ElementForm
          values={data}
          itemValues={data}
          handleRemoveImage={handleRemoveImage}
          handleGetImages={handleGetImages}
          handleChange={handleChange}
          setLoading={setLoading}
          visible={status}
          onHiding={() => setPopupStatus(false)}
          {...FormData}
        />
      )}
    </Dialog>
  );
}

export default memo(CrudForm);
