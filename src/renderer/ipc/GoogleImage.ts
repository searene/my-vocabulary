import { ipcRenderer } from "electron";

document.addEventListener("click", event => {
  console.log("inside");
  ipcRenderer.sendToHost("test from inside")
});
