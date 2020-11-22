import { remote } from "electron";

export const menu = remote.Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {
        label: "Settings",
        click: () => alert("test"),
      },
    ],
  },
]);
