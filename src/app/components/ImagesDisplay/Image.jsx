import * as React from "react";
import { useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ImageBaseUrl } from "../../services/config";
export default function Image({ open, setOpen, idx = 0, data }) {
  return (
    <>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={data.map((element) => ({
          src:
            typeof element == "string"
              ? ImageBaseUrl + element
              : URL.createObjectURL(element),
        }))}
        index={idx}
        plugins={[Zoom, Fullscreen, Thumbnails]}
        toolbar
      />
    </>
  );
}
