import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Container } from "semantic-ui-react";
import { Menu } from "./Menu";
import { remote } from "electron";
import { menu } from "../MenuFactory";

const Application = () => (
  <Container style={{ marginTop: "50px" }}>
    <Menu />
  </Container>
);

remote.Menu.setApplicationMenu(menu);

export default hot(Application);
