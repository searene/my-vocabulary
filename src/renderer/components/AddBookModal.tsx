import { Button, Grid, Input, InputOnChangeData, Modal } from "semantic-ui-react";
import * as React from "react";

interface AddBookModalProps {
  visible: boolean
  onOpen: () => void;
  onCancel: () => void;
  onConfirm: (bookFilePath: string) => void;
  trigger: React.ReactNode;
}

interface AddBookModalStates {
  bookFilePath: string;
}

export class AddBookModal extends React.Component<AddBookModalProps, AddBookModalStates> {
  constructor(props: AddBookModalProps) {
    super(props);
    this.state = {
      bookFilePath: ""
    };
  }

  render() {
    return (
      <Modal
        onOpen={this.props.onOpen}
        onClose={this.props.onCancel}
        open={this.props.visible}
        trigger={this.props.trigger}
      >
        <Modal.Header>Input the Book Path</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Input value={this.state.bookFilePath}
                     onChange={this.handleBookFilePathChange}
                     style={{width: "100%"}}/>
            </Grid.Row>
            <Grid.Row>
              <div style={{width: "100%", textAlign: "right"}}>
                <Button primary
                        onClick={() => this.props.onConfirm(this.state.bookFilePath)}>
                  OK
                </Button>
                <Button onClick={() => this.props.onCancel()}>
                  Cancel
                </Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }

  private handleBookFilePathChange(event: React.ChangeEvent<HTMLInputElement>,
                                   data: InputOnChangeData) {
    this.setState({
      bookFilePath: data.value
    });
  }

}