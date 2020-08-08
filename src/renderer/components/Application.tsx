import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Container } from "semantic-ui-react";
import { Library } from "./Library";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { Book } from "./Book";

const Application = () => (
  <Container style={{marginTop: "50px"}}>
    <BrowserRouter>
      <Switch>
        <Route path={"/"} component={Library} exact/>
        <Route path={"/book/:bookId"} component={Book}/>
      </Switch>
    </BrowserRouter>
  </Container>
);

export default hot(Application);
