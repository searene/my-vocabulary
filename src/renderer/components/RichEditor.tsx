import * as React from "react";
import { createRef } from "react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
}
interface RichEditorStates {}

export class RichEditor extends React.Component<
  RichEditorProps,
  RichEditorStates
> {
  private divComponent = createRef<HTMLDivElement>();
  private lastValue: string = "";

  constructor(props: RichEditorProps) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps: RichEditorProps) {
    return nextProps.value !== this.divComponent.current!.innerHTML;
  }

  getHtmlContents() {
    return this.divComponent.current!.innerHTML;
  }

  private emitChange = () => {
    const currentValue = this.divComponent.current!.innerHTML;
    if (currentValue !== this.lastValue) {
      this.props.onChange(currentValue);
    }
    this.lastValue = currentValue;
  };

  render() {
    return (
      <div
        onInput={this.emitChange}
        onBlur={this.emitChange}
        ref={this.divComponent}
        contentEditable
        suppressContentEditableWarning
        style={{
          border: "1px solid black",
        }}
      ></div>
    );
  }
}
