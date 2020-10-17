import * as React from "react";
import {
  Header,
  Container,
  Divider,
  Table,
  Icon,
  Grid,
  Button,
  Modal,
} from "semantic-ui-react";
import { AddBookModal } from "./AddBookModal";
import { BookVO } from "../../main/domain/BookVO";
import serviceProvider from "../ServiceProvider";
import { RouteComponentProps } from "react-router";

interface LibraryProps extends RouteComponentProps {}

interface LibraryStates {
  books: BookVO[];
  initiated: boolean;
  showAddBookModal: boolean;
  showRemoveBookModal: boolean;
}

export class Library extends React.Component<LibraryProps, LibraryStates> {
  constructor(props: LibraryProps) {
    super(props);
    this.state = {
      books: [],
      initiated: false,
      showAddBookModal: false,
      showRemoveBookModal: false,
    };
  }

  async componentDidMount() {
    await this.init();
  }

  render() {
    if (!this.state.initiated) {
      return <></>;
    }
    return (
      <Container>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column width={8}>
              <Header>Books</Header>
            </Grid.Column>
            <Grid.Column textAlign={"right"} width={8}>
              <AddBookModal
                visible={this.state.showAddBookModal}
                onOpen={() => this.setState({ showAddBookModal: true })}
                onClose={this.handleCloseOnAddBookModal}
                trigger={
                  <Button icon labelPosition={"left"}>
                    <Icon name={"add"} /> Add
                  </Button>
                }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider />
        <Table basic="very" selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Total Word Count</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.books.map(book => (
              <Table.Row key={book.id}>
                <Table.Cell
                  onClick={() => this.handleClickOnBook(book)}
                  className={"hover-link"}
                >
                  {book.name}
                </Table.Cell>
                <Table.Cell>{book.totalWordCount}</Table.Cell>
                <Modal
                  closeIcon
                  open={this.state.showRemoveBookModal}
                  trigger={
                    <Table.Cell>
                      <Button
                        color={"red"}
                        onClick={() =>
                          this.setState({ showRemoveBookModal: true })
                        }
                      >
                        Remove
                      </Button>
                      <Button>Review</Button>
                    </Table.Cell>
                  }
                  onClose={() => this.setState({ showRemoveBookModal: false })}
                  onOpen={() => this.setState({ showRemoveBookModal: true })}
                >
                  <Header content="Confirm" />
                  <Modal.Content>
                    <p>Do you really want to delete this book: {book.name}?</p>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      color="red"
                      onClick={() =>
                        this.setState({ showRemoveBookModal: false })
                      }
                    >
                      <Icon name="remove" /> No
                    </Button>
                    <Button
                      color="green"
                      onClick={() => this.handleRemoveBook(book.id)}
                    >
                      <Icon name="checkmark" /> Yes
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    );
  }

  private async init() {
    await this.initBooks();
    this.setState({
      initiated: true,
    });
  }

  private async initBooks() {
    const books = await serviceProvider.bookService.getBooks();
    this.setState({ books });
  }

  private handleCloseOnAddBookModal = (addedBook?: BookVO) => {
    const books =
      addedBook === undefined
        ? this.state.books
        : this.state.books.concat(addedBook);
    this.setState({
      books,
      showAddBookModal: false,
    });
  };

  private handleClickOnBook = (book: BookVO) => {
    this.props.history.push("/book/" + book.id);
  };

  private handleRemoveBook = async (bookId: number) => {
    await serviceProvider.bookService.removeBook(bookId);
    const newBooks = this.state.books.filter(book => book.id != bookId);
    this.setState({
      showRemoveBookModal: false,
      books: newBooks,
    });
  };
}
