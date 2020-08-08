import * as React from "react";
import { Header, Container, Divider, Table, Icon, Grid, Button} from "semantic-ui-react";
import { AddBookModal } from "./AddBookModal";
import { BookVO } from "../../main/domain/BookVO";
import { remote } from 'electron';
const mainJs = remote.require("./main.js");
const bookService = mainJs.bookService;

interface LibraryProps {
}

interface LibraryStates {
  books: BookVO[],
  initiated: boolean,
  showAddBookModal: boolean;
}

export class Library extends React.Component<LibraryProps, LibraryStates> {

  constructor(props: LibraryProps) {
    super(props);
    this.state = {
      books: [],
      initiated: false,
      showAddBookModal: false
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
                  <AddBookModal visible={this.state.showAddBookModal}
                                onOpen={() => this.setState({showAddBookModal: true})}
                                onClose={this.handleCloseOnAddBookModal}
                                trigger={<Button icon labelPosition={"left"}>
                                            <Icon name={"add"}/> Add
                                          </Button>}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
        <Divider/>
        <Table basic="very">
          <Table.Header>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Total Word Count</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {this.state.books.map(book =>
              <Table.Row>
                <Table.Cell>
                  book.name
                </Table.Cell>
                <Table.Cell>
                  book.totalWordCount
                </Table.Cell>
              </Table.Row>,
            )}
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
    const books = await bookService.getBooks();
    this.setState({ books });
  }

  private handleCloseOnAddBookModal = () => {
    this.setState({
      showAddBookModal: false
    });
  }
}