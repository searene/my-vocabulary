import * as React from "react";
import { Icon } from "semantic-ui-react";
import { CSSProperties, MouseEventHandler } from "react";
import { Router } from "../../route/Router";
import "./GoBack.less";

interface GoBackProps {
  style?: CSSProperties
}

export const GoBack = (props: GoBackProps) => {

  const handleClick: MouseEventHandler = (e) => {
    Router.toLibraryPage();
  }

  return (
    <Icon id="go-back" name={"chevron left"} onClick={handleClick} style={props.style}/>
  )
}