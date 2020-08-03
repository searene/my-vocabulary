import { Button, Grid, Input, InputOnChangeData, Loader, Modal } from "semantic-ui-react";
import * as React from "react";
import { container } from "../../main/config/inversify.config";
import { BookService } from "../../main/BookService";

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
        <Loader active={this.state.loading}/>
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

  private handleBookFilePathChange(event: React.ChangeEvent<HTMLInputElement>,
                                   data: InputOnChangeData) {
    this.setState({
      bookFilePath: data.value
    });
  }

  private async handleOK() {
    this.setState({
      loading: true
    });
    const bookService = container.get(BookService);
    // const booKId = await bookService.addBook(this.state.bookFilePath);
    this.setState({
      loading: false
    });
    this.props.onClose();
  }

}