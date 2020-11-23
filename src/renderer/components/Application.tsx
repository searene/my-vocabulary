import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Container } from "semantic-ui-react";
import { Menu } from "./Menu";
import { SettingsDialog } from "./settings/SettingsDialog";

const Application = () => (
  <Container style={{ marginTop: "50px" }}>
    <Menu />
    <SettingsDialog />
  </Container>
);
export default hot(Application);
