import { hot } from "react-hot-loader/root";
import * as React from "react";
import { Button } from "semantic-ui-react";

const Application = () => (
  <div>
    Hello World from Electron!
    <Button>Test Button</Button>
  </div>
);

export default hot(Application);
