import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";
import { AppContainer } from "react-hot-loader";
import "semantic-ui-css/semantic.min.css";
import "./style/style.less";
import { Provider } from "react-redux";
import store from "./redux/store";
import { menu } from "./MenuFactory";
import { remote } from "electron";
import { Container, Modal } from "semantic-ui-react";
import { Menu } from "./components/Menu";
import { SettingsDialog } from "./components/settings/SettingsDialog";
import { BrowserDialog } from "./components/browser/BrowserDialog";

// Create main element
const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

// Render components
ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      {hot(
        <Container style={{ marginTop: "50px" }}>
        <Menu />
        <SettingsDialog />
        <BrowserDialog />
      </Container>
      )}
    </Provider>
  </AppContainer>,
  mainElement
);

remote.Menu.setApplicationMenu(menu);
