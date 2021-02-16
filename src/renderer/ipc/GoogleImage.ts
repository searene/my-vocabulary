import { ipcRenderer } from "electron";
import "./menu/ContextMenu";

document.addEventListener("click", event => {
  console.log("inside");
  ipcRenderer.sendToHost("test from inside");
});
