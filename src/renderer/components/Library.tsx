import * as React from "react";
import { Header, Container, Divider, Table, Icon, Grid, Button, ButtonProps } from "semantic-ui-react";
import { AddBookModal } from "./AddBookModal";

interface Book {
  name: string;
  totalWordCount: number;
}

interface LibraryProps {
}

interface LibraryStates {
  books: Book[],
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
                                onCancel={() => this.setState({showAddBookModal: false})}
                                onConfirm={this.addBook}
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
    const books = await this.getBooks();
  }

  private async getBooks(): Promise<Book[]> {
    const books: Book[] = [];
    const book1: Book = {
      name: "Ten Drugs",
      totalWordCount: 123498,
    };
    const book2: Book = {
      name: "Mock book2",
      totalWordCount: 729347,
    };
    books.push(book1);
    books.push(book2);
    return books;
  }

  private async addBook(bookFilePath: string): Promise<void> {
  }
}