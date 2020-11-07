import * as React from "react";
import { useEffect, useState, FunctionComponent } from "react";
import { Icon } from "semantic-ui-react";
import { BarItemProps } from "./BarItem";

interface RightBarProps {}

export const RightBar: FunctionComponent<RightBarProps> = function (props) {
  const [childComponent, setChildComponent] = useState<JSX.Element | undefined>(
    undefined
  );

  const getBarItemComponent = () => {
    if (childComponent === undefined) {
      return <></>;
    }
    return <div>{childComponent}</div>;
  };

  const toggleComponent = (component: JSX.Element) => {
    setChildComponent(childComponent === undefined ? component : undefined);
  };

  const barItemIcons = React.Children.map(props.children, (barItem) => {
    if (!React.isValidElement(barItem)) {
      return;
    }
    const barItemProps = barItem.props as BarItemProps;
    return (
      <Icon
        name={barItemProps.icon}
        size="large"
        onClick={() => toggleComponent(barItemProps.component)}
      />
    );
  });

  return (
    <div style={{ width: "50px", height: "100%", display: "flex" }}>
      {getBarItemComponent()}
      <div style={{ height: "100%", border: "1px solid black" }}>
        {barItemIcons}
      </div>
    </div>
  );
};
