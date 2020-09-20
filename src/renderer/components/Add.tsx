import * as React from "react";
import { Grid } from "semantic-ui-react";
import { RouteComponentProps } from "react-router";
import serviceProvider from "../ServiceProvider";

interface MatchParams {
  bookId: string;
}

interface AddProps extends RouteComponentProps<MatchParams> {}

interface AddStates {
  initiated: boolean;
  bookName: string;
}

export class Add extends React.Component<AddProps, AddStates> {
  constructor(props: AddProps) {
    super(props);
    this.state = {
      initiated: false,
      bookName: "",
    };
  }

  async componentDidMount() {
    await this.init();
  }

  async init() {
    const bookId = parseInt(this.props.match.params.bookId);
    const bookName = (await serviceProvider.bookService.getBook(bookId)).name;
    this.setState({
      initiated: true,
      bookName: bookName,
    });
  }

  render(): React.ReactNode {
    if (!this.state.initiated) {
      return <></>;
    }
    return (
      <Grid divided={"vertically"}>
        <Grid.Row columns={1}>
          <Grid.Column>Book: {this.state.bookName}</Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
