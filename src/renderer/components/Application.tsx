import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Container } from "semantic-ui-react";
import { Library } from "./Library";

const Application = () => (
  <Container style={{marginTop: "50px"}}>
    <Library/>
  </Container>
);

export default hot(Application);
