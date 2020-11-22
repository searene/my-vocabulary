import { app, Menu } from "electron";

export const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [{ role: "undo" }],
  },
]);
