import { useState, useEffect } from "react";
import * as React from 'react';
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
import { Router } from "../route/Router";

interface LibraryProps extends RouteComponentProps {}

export function Library(props: LibraryProps) {
  const [books, setBooks] = useState<BookVO[]>([]);
  const [initiated, setInitiated] = useState(false);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showRemoveBookModal, setShowRemoveBookModal] = useState(false);

  useEffect(() => {
    if (!initiated) {
      init();
    }
  }, [initiated]);

  const init = async () => {
    await initBooks();
    setInitiated(true);
  };

  const initBooks = async () => {
    const books = await serviceProvider.bookService.getNormalBooks();
    setBooks(books);
  };

  const handleCloseOnAddBookModal = (addedBook?: BookVO) => {
    setBooks(addedBook === undefined ? books : books.concat(addedBook));
    setShowAddBookModal(false);
  };

  const handleClickOnBook = (book: BookVO) => {
    Router.toBookPage(book.id);
  };

  const handleRemoveBook = async (bookId: number) => {
    await serviceProvider.bookService.removeBook(bookId);
    const newBooks = books.filter((book) => book.id != bookId);
    setShowAddBookModal(false);
    setBooks(newBooks);
  };

  return initiated ? (
    <Container>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header>Books</Header>
          </Grid.Column>
          <Grid.Column textAlign={"right"} width={8}>
            <AddBookModal
              visible={showAddBookModal}
              onOpen={() => setShowAddBookModal(true)}
              onClose={handleCloseOnAddBookModal}
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
            <Table.HeaderCell>To Be Reviewed</Table.HeaderCell>
            <Table.HeaderCell>Card Added Today</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {books.map((book) => (
            <Table.Row key={book.id}>
              <Table.Cell
                onClick={() => handleClickOnBook(book)}
                className={"hover-link"}
              >
                {book.name}
              </Table.Cell>
              <Table.Cell>{book.totalWordCount}</Table.Cell>
              <Table.Cell>{book.dueCardInstanceCount}</Table.Cell>
              <Table.Cell>{book.todayAddedCardCount}</Table.Cell>
              <Modal
                closeIcon
                open={showRemoveBookModal}
                trigger={
                  <Table.Cell>
                    <Button
                      color={"red"}
                      onClick={() => setShowRemoveBookModal(true)}
                    >
                      Remove
                    </Button>
                  </Table.Cell>
                }
                onClose={() => setShowRemoveBookModal(false)}
                onOpen={() => setShowRemoveBookModal(true)}
              >
                <Header content="Confirm" />
                <Modal.Content>
                  <p>Do you really want to delete this book: {book.name}?</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    color="red"
                    onClick={() => setShowRemoveBookModal(false)}
                  >
                    <Icon name="remove" /> No
                  </Button>
                  <Button
                    color="green"
                    onClick={() => handleRemoveBook(book.id)}
                  >
                    <Icon name="checkmark" /> Yes
                  </Button>
                </Modal.Actions>
              </Modal>
              <Table.Cell>
                <Button onClick={() => Router.toReviewPage(book.id)}>
                  Review
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
      </Table.Body>
      </Table>
    </Container>
  ) : (
    <></>
  );
}
