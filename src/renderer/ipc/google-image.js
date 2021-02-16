const { ipcRenderer } = require('electron')

document.addEventListener("click", event => {
  alert("inside");
  alsert(ipcRenderer);
  ipcRenderer.send("something", event);
})