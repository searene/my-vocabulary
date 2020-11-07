import * as React from "react";
import { useState, useEffect } from "react";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";

export interface BarItemProps {
  icon: SemanticICONS;
  component: JSX.Element;
}

export const BarItem = function (props: BarItemProps) {
  return <div>test</div>;
};
