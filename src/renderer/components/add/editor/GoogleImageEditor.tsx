import * as React from "react";
import { Modal } from "semantic-ui-react";
import { useEffect, useRef } from "react";
import { remote } from "electron";

interface GoogleImageProps {
  word: string;
}

export function GoogleImageEditor(props: GoogleImageProps) {
  const [showModal, setShowModal] = React.useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function inner() {
      const view = new remote.BrowserView();
      remote.getCurrentWindow().addBrowserView(view);
      view.setBounds({
        x: 0,
        y: 0,
        width: remote.getCurrentWindow().getContentBounds()['width'] - 50,
        height: remote.getCurrentWindow().getContentBounds()["height"] - 50,
      });
      await view.webContents.loadURL(`https://www.google.com/search?tbm=isch&q=${props.word}`);
    }
    inner();
  }, []);

  return (
    <Modal
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
        {/*<iframe style={{width: "100%", height: "100%"}}*/}
        {/*        // src={"https://www.baidu.com"}*/}
        {/*        src={`https://www.google.com/search?tbm=isch&q=${props.word}`}*/}
        {/*        ref={iframeRef}/>*/}
      </Modal.Content>
    </Modal>
  )
}