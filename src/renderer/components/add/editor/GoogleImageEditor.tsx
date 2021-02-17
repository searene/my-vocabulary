import * as React from "react";
import { Modal } from "semantic-ui-react";
import { useEffect, useRef } from "react";
import { ConsoleMessageEvent, IpcMessageEvent, remote } from "electron";

interface GoogleImageProps {
  word: string;
}

export function GoogleImageEditor(props: GoogleImageProps) {
  const [showModal, setShowModal] = React.useState(false);
  const webviewRef = useRef<HTMLWebViewElement>(null);

  useEffect(() => {
    webviewRef.current?.addEventListener("console-message", (e) => {
      console.log("WEBVIEW", (e as ConsoleMessageEvent).message);
    });
    webviewRef.current?.addEventListener("ipc-message", (event) => {
      console.log((event as IpcMessageEvent).channel);
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
      trigger={<div style={{border: "1px solid black", minHeight: "50px", color: "gray"}}>
        Click here to select images...
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