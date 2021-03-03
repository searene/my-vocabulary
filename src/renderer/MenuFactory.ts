import { remote } from "electron";
import store from "./redux/store";
import { changeSettingsVisibility } from "./components/settings/settingsSlice";
import { setBrowserVisibility } from "./components/browser/browserSlice";
import serviceProvider from "./ServiceProvider";
import { setImportDialogVisibility } from "./components/import/importSlice";

export const menu = remote.Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [{
      label: "Settings",
      click: () => store.dispatch(changeSettingsVisibility(true)),
    }, {
      label: "Browser",
      click: () => store.dispatch(setBrowserVisibility(true)),
    }, {
      label: "Import Known Words",
      click: () => store.dispatch(setImportDialogVisibility(true)),
    }],
  }, {
    label: "Develop",
    submenu: [{
      label: "Toggle Dev Tools",
      click: () => remote.getCurrentWebContents().toggleDevTools(),
    }]
  }
]);
