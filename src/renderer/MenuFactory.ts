import { remote } from "electron";
import store from "./redux/store";
import { changeSettingsVisibility } from "./components/settings/settingsSlice";

export const menu = remote.Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {
        label: "Settings",
        click: () => store.dispatch(changeSettingsVisibility(true)),
      },
    ],
  },
]);
