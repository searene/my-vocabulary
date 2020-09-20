import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import Application from "./components/Application";
import "semantic-ui-css/semantic.min.css";
import "./style/style.less";

if (process.env.RENDERER_ENV === "electron") {
  require("electron-unhandled")();
}

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

// Render components
const render = (Component: () => JSX.Element) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    mainElement
  );
};

render(Application);
