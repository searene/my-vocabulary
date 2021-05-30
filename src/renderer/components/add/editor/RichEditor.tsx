import * as React from "react";
import { createRef } from "react";

interface RichEditorProps {
  htmlContents: string;
  onChange: (originalContents: string, plainTextContents: string) => void;
}
interface RichEditorStates {}

export class RichEditor extends React.Component<
  RichEditorProps,
  RichEditorStates
> {
  private divComponent = createRef<HTMLDivElement>();
  private lastValue = this.props.htmlContents;

  constructor(props: RichEditorProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.divComponent.current!.innerHTML = this.props.htmlContents;
    this.divComponent.current!.addEventListener("paste", (event) => {
      const dataTransfer = event.clipboardData;
      const html = dataTransfer?.getData("text/html");
      if (html !== "") {
        document.execCommand("insertHTML", false, html);
        event.preventDefault();
      }
    });
  }

  shouldComponentUpdate(nextProps: RichEditorProps) {
    return nextProps.htmlContents !== this.divComponent.current!.innerHTML;
  }

  getHtmlContents() {
    return this.divComponent.current!.innerHTML;
  }

  private emitChange = () => {
    const currentValue = this.divComponent.current!.innerHTML;
    if (currentValue !== this.lastValue) {
      this.props.onChange(currentValue, this.divComponent.current!.innerText);
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
      />
    );
  }
}
