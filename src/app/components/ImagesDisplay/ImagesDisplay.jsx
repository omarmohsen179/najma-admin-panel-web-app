import * as React from "react";
import { useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/styles.css";
import Image from "./Image";
import { ImageBaseUrl } from "../../services/config";
export default function ImagesDisplay({
  data,
  handleRemoveImage,
  height = "100px",
}) {
  const [open, setOpen] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  useEffect((e) => setIdx(0), [data]);

  return (
    <>
      {data.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            minHeight: height,

            gap: "20px",
            flexWrap: "wrap",
            margin: 10,
            position: "relative",
          }}
        >
          {data.map((element, index) => {
            return (
              <div
                style={{
                  height: height,
                  position: "relative",
                  cursor: "pointer",
                  padding: 5,
                }}
                onClick={() => {
                  setOpen(true);
                  setIdx(index);
                }}
              >
                {handleRemoveImage != null && (
                  <AiFillCloseCircle
                    style={{
                      position: "absolute",
                      top: "5%",
                      right: "3%",
                      cursor: "pointer",
                      color: "red",
                    }}
                    size={25}
                    onClick={() => handleRemoveImage(element)}
                  />
                )}

                <img
                  alt={"img"}
                  style={{
                    width: "auto",
                    height: "auto",
                    maxHeight: height,
                    maxWidth: "100%",
                  }}
                  src={
                    typeof element == "string"
                      ? ImageBaseUrl + element
                      : URL.createObjectURL(element)
                  }
                />
              </div>
            );
          })}
          <Image open={open} setOpen={setOpen} idx={idx} data={data} />
        </div>
      )}
    </>
  );
}
