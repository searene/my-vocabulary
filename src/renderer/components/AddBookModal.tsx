import {
  Button,
  Dimmer,
  Grid,
  Input,
  InputOnChangeData,
  Loader,
  Modal,
} from "semantic-ui-react";
import * as React from "react";
import serviceProvider from "../ServiceProvider";
import { BookVO } from "../../main/domain/BookVO";

interface AddBookModalProps {
  visible: boolean;
  onOpen: () => void;
  onClose: (addedBook?: BookVO) => void;
  trigger: React.ReactNode;
}

interface AddBookModalStates {
  bookFilePath: string;
  loading: boolean;
}

export class AddBookModal extends React.Component<
  AddBookModalProps,
  AddBookModalStates
> {
  constructor(props: AddBookModalProps) {
    super(props);
    this.state = {
      // TODO this is only for test, remove it after testing
      bookFilePath:
        "/home/searene/WebstormProjects/my-vocabulary/resources/test-book.txt",
      loading: false,
    };
  }

  render() {
    return (
      <Modal
        onOpen={this.props.onOpen}
        onClose={() => this.props.onClose()}
        open={this.props.visible}
        trigger={this.props.trigger}
      >
        <Modal.Header>Input the Book Path</Modal.Header>
        <Modal.Content>
          <Grid>
            <Grid.Row>
              <Input
                value={this.state.bookFilePath}
                onChange={this.handleBookFilePathChange}
                style={{ width: "100%" }}
              />
            </Grid.Row>
            <Grid.Row>
              <div style={{ width: "100%", textAlign: "right" }}>
                <Dimmer active={this.state.loading} inverted>
                  <Loader active={this.state.loading} />
                </Dimmer>
                <Button primary onClick={this.handleOK}>
                  OK
                </Button>
                <Button onClick={() => this.props.onClose()}>Cancel</Button>
              </div>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }

  private handleBookFilePathChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void = (event, data) => {
    this.setState({
      bookFilePath: data.value,
    });
  };

  private handleOK = async () => {
    this.setState({
      loading: true,
    });
    const bookVO = await serviceProvider.bookService.addBook(
      this.state.bookFilePath
    );
    this.setState({
      loading: false,
    });
    this.props.onClose(bookVO);
  };
}
