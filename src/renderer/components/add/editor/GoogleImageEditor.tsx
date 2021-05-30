import * as React from "react";
import { Modal } from "semantic-ui-react";
import { useEffect, useRef } from "react";
import { ConsoleMessageEvent, IpcMessageEvent } from "electron";
import serviceProvider from "../../../ServiceProvider";
import { isBlank } from "../../../utils/StringUtils";
import { image } from "html-to-text/lib/formatter";
import { isNullOrUndefined } from "../../../../main/utils/ObjectUtils";

interface GoogleImageProps {
  word: string;
  imgSrc: string;
  onImgSrcChange: (imgSrc: string) => void;
}

export const getImageHtml = (imgSrc: string, word: string): string =>
  `<img src="${imgSrc}" alt="${word}" class="card-img" />`;

export const extractSrcFromHtml = (html: string): string => {
  const element = document.createElement("html");
  element.innerHTML = html;
  const images: HTMLCollectionOf<HTMLImageElement> = element.getElementsByTagName("img");
  if (isNullOrUndefined(images) || images.length === 0) {
    return "";
  } else {
    return images[0].src;
  }
}

export function GoogleImageEditor(props: GoogleImageProps) {
  const [showModal, setShowModal] = React.useState(false);
  const webviewRef = useRef<HTMLWebViewElement>(null);

  useEffect(() => {
    webviewRef.current?.addEventListener("console-message", (e) => {
      console.log("WEBVIEW", (e as ConsoleMessageEvent).message);
    });
    webviewRef.current?.addEventListener("ipc-message", async (event) => {
      let imageSrc = (event as IpcMessageEvent).channel;
      if (imageSrc === undefined) {
        return;
      }
      if (imageSrc.startsWith("http") || imageSrc.startsWith("https")) {
        const imageInfo = await serviceProvider.resourceService.saveImage(imageSrc);
        imageSrc = imageInfo.internalLink;
      }
      props.onImgSrcChange(imageSrc);
      setShowModal(false);
    });
  }, [showModal]);

  return (
    <Modal
      closeIcon
      onClose={() => setShowModal(false)}
      onOpen={() => setShowModal(true)}
      open={showModal}
      style={{
        width: "100%",
        height: "100%",
      }}
      trigger={<div style={{
        border: "1px solid black",
        minHeight: "50px",
        color: "gray",
        width: "100%",
        maxHeight: "300px",
        overflow: "hidden",
      }}>
        {isBlank(props.imgSrc) ? "Click here to select images..." :
          <img src={props.imgSrc} alt={props.word} className="card-img" style={{
            height: "300px",
          }}/>
        }
      </div>}>
      <Modal.Header>Select an image</Modal.Header>
      <Modal.Content>
        <webview src={`https://www.google.com/search?tbm=isch&q=${props.word}`}
                 ref={webviewRef}
                 style={{width: "100vw", height: "100vh"}}
                 preload={"./ipc/google-image.js"}
        />
      </Modal.Content>
    </Modal>
  );
}