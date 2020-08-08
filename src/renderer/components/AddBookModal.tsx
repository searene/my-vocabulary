import { Button, Dimmer, Grid, Input, InputOnChangeData, Loader, Modal } from "semantic-ui-react";
import * as React from "react";
import { remote } from 'electron';
const mainJs = remote.require("./main.js");
const bookService = mainJs.bookService;

interface AddBookModalProps {
  visible: boolean
  onOpen: () => void;
  onClose: () => void;
  trigger: React.ReactNode;
}

interface AddBookModalStates {
  bookFilePath: string;
  loading: boolean;
}

export class AddBookModal extends React.Component<AddBookModalProps, AddBookModalStates> {
  constructor(props: AddBookModalProps) {
    super(props);
    this.state = {
      // TODO this is only for test, remove it after testing
      bookFilePath: "/home/searene/WebstormProjects/my-vocabulary/test/resources/GeographyofBliss_oneChapter.epub",
      loading: false
    };
  }

  render() {
    return (
      <Modal
        onOpen={this.props.onOpen}
        onClose={this.props.onClose}
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
                <Loader inverted disabled={!this.state.loading}/>
                <Button primary
                        onClick={this.handleOK}>
                  OK
                </Button>
                <Button onClick={() => this.props.onClose()}>
                  Cancel
                </Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }

  private handleBookFilePathChange: (event: React.ChangeEvent<HTMLInputElement>,
                 data: InputOnChangeData) => void = (event, data) => {
    this.setState({
      bookFilePath: data.value
    });
  };


  private handleOK = async () => {
    console.log("here");
    this.setState({
      loading: true
    });
    console.log(bookService);
    const booKId = await bookService.addBook(this.state.bookFilePath);
    this.setState({
      loading: false
    });
    this.props.onClose();
    console.log("there");
  }

}