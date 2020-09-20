import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Container } from "semantic-ui-react";
import { Library } from "./Library";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Book } from "./Book";
import { Menu } from "./Menu";
import { createHashHistory } from "history";
import { createHash } from "crypto";

const Application = () => (
  <Container style={{ marginTop: "50px" }}>
    <Menu />
  </Container>
);

export default hot(Application);
