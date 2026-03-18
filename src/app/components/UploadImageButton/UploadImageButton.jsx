import { memo, useRef } from "react";

import { useTranslation } from "react-i18next";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import ImagesDisplay from "../ImagesDisplay/ImagesDisplay";

const UploadImageButton = ({
  isMultiple,
  handleGetImages,
  handleRemoveImage,
  handleRemoveAllImages,
  imagesFiles,
  required = false,
  title = "Upload Image",
}) => {
  const { t, i18n } = useTranslation();
  const fileInput = useRef();

  return (
    <div style={{ width: "100%" }}>
      <div
        className="inputField"
        style={{
          direction: i18n.language === "en" ? "ltr" : "rtl",
        }}
      >
        <input
          ref={fileInput}
          accept="image/*"
          type={"file"}
          required={required}
          className={"d-none"}
          onClick={(event) => {
            const element = event.target;
            element.value = "";
          }}
          onChange={(event) => handleGetImages(event)}
          multiple={isMultiple}
        />
        <ButtonComponent
          title={title}
          onClick={() => fileInput.current.click()}
          icon={"fas fa-images"}
        />

        <div className="w-100 d-flex align-items-center  ">
          {imagesFiles.length > 0 ? (
            <span className="clearAllOption" onClick={handleRemoveAllImages}>
              {isMultiple ? t("Clear All?") : ""}
            </span>
          ) : (
            ""
          )}
        </div>

        <ImagesDisplay
          data={imagesFiles}
          handleRemoveImage={handleRemoveImage}
          height={"300px"}
        />
      </div>
    </div>
  );
};

export default memo(UploadImageButton);
