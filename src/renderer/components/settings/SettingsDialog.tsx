import * as React from "react";
import { useSelector } from "react-redux";
import { selectSettingsVisibility } from "./settingsSlice";

export const SettingsDialog = () => {
  const visibility: boolean = useSelector(selectSettingsVisibility);

  return visibility ? <div>Settings</div> : <></>;
};
