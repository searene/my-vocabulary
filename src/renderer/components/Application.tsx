import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Container } from "semantic-ui-react";
import { Library } from "./Library";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Book } from "./Book";

const Application = () => (
  <Container style={{marginTop: "50px"}}>
    <HashRouter>
      <Switch>
        <Route path={"/"} component={Library} exact/>
        <Route path={"/book/:bookId"} component={Book}/>
      </Switch>
    </HashRouter>
  </Container>
);

export default hot(Application);
