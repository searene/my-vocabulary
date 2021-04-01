import * as React from "react";
import { Modal } from "semantic-ui-react";
import { useEffect, useRef } from "react";
import { ConsoleMessageEvent, IpcMessageEvent } from "electron";
import serviceProvider from "../../../ServiceProvider";

interface GoogleImageProps {
  word: string;
  onChange: (html: string) => void;
}

export function GoogleImageEditor(props: GoogleImageProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState<string | undefined>(undefined);
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
        console.log("before saving images");
        const imageInfo = await serviceProvider.resourceService.saveImage(imageSrc);
        console.log("after saving images");
        imageSrc = imageInfo.internalLink;
      }
      setImgSrc(imageSrc);
      props.onChange(`<img src="${imageSrc}" alt="${props.word}" class="card-img" />`)
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
        {imgSrc == undefined ? "Click here to select images..." :
          <img src={imgSrc} alt={props.word} className="card-img" style={{
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