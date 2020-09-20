import {
  Grid,
  Menu as SemanticMenu,
  MenuItemProps,
  Segment,
} from "semantic-ui-react";
import * as React from "react";
import { Library } from "./Library";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Book } from "./Book";
import { RouteComponentProps } from "react-router";
import { Optional } from "typescript-optional";
import serviceProvider from "../ServiceProvider";
import history from "../route/History";
import { Add } from "./Add";

interface MenuProps {}

interface MenuStates {
  activeMenuItem: string;
  bookId: Optional<number>;
  initiated: boolean;
}

export class Menu extends React.Component<MenuProps, MenuStates> {
  constructor(props: MenuProps) {
    super(props);
    this.state = {
      activeMenuItem: "Library",
      bookId: Optional.empty(),
      initiated: false,
    };
  }

  async componentDidMount() {
    await this.init();
  }

  async init() {
    const bookId = (await serviceProvider.bookService.getFirstBook()).map(
      bookVO => bookVO.id
    );
    this.setState({
      bookId: bookId,
      initiated: true,
    });
  }

  render() {
    if (!this.state.initiated) {
      return <></>;
    }
    return (
      <Grid>
        <Grid.Column width={2}>
          <SemanticMenu fluid vertical tabular>
            <SemanticMenu.Item
              name={"Library"}
              active={this.state.activeMenuItem === "Library"}
              onClick={this.handleItemClick}
            />
            <SemanticMenu.Item
              name={"Book"}
              active={this.state.activeMenuItem === "Book"}
              onClick={this.handleItemClick}
            />
            <SemanticMenu.Item
              name={"Add"}
              active={this.state.activeMenuItem === "Add"}
              onClick={this.handleItemClick}
            />
            <SemanticMenu.Item
              name={"Review"}
              active={this.state.activeMenuItem === "Review"}
              onClick={this.handleItemClick}
            />
          </SemanticMenu>
        </Grid.Column>
        <Grid.Column stretched width={14}>
          <Segment>
            <HashRouter>
              <Switch>
                <Route path={"/"} component={Library} exact />
                <Route path={"/book/:bookId"} component={Book} />
                <Route path={"/add/:bookId"} component={Add} />
              </Switch>
            </HashRouter>
          </Segment>
        </Grid.Column>
      </Grid>
    );
  }

  private handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps
  ): void => {
    this.setState({
      activeMenuItem: data.name as string,
    });

    if (data.name === "Library") {
      history.push("/");
    } else if (data.name === "Book") {
      history.push(
        "/book" +
          (this.state.bookId.isPresent() ? "/" + this.state.bookId.get() : "")
      );
    } else if (data.name === "Add") {
      history.push(
        "/add" +
          (this.state.bookId.isPresent() ? "/" + this.state.bookId.get() : "")
      );
    }
  };
}
