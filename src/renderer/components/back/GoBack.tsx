import * as React from "react";
import { Icon } from "semantic-ui-react";
import { MouseEventHandler } from "react";
import { Router } from "../../route/Router";
import "./GoBack.less";

export const GoBack = () => {

  const handleClick: MouseEventHandler = (e) => {
    Router.toLibraryPage();
  }

  return (
    <Icon id="go-back" name={"chevron left"} onClick={handleClick} />
  )
}