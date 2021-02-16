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

  const showBrowserView = async () => {
    const view = new remote.BrowserView({
      webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        preload: "ipc/google-image.js"
      }
    });
    remote.getCurrentWindow().addBrowserView(view);
    view.setBounds({
      x: 50,
      y: 50,
      width: remote.getCurrentWindow().getContentBounds()['width'] - 100,
      height: remote.getCurrentWindow().getContentBounds()["height"] - 100,
    });
    view.setAutoResize({ width: true, height: true })
    await view.webContents.loadURL(`https://www.google.com/search?tbm=isch&q=${props.word}`);
  }

  useEffect(() => {
    remote.ipcMain.on("something", (event, arg) => {
      alert("test");
    });
  });

  return (
    <div style={{border: "1px solid black", minHeight: "50px", color: "gray"}}
         onClick={showBrowserView}>
      Click here to select images...
    </div>
  );
}