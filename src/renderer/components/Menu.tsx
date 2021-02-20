import {
  Grid,
  Menu as SemanticMenu,
  MenuItemProps,
  Segment,
} from "semantic-ui-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { Library } from "./Library";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Book } from "./book/Book";
import serviceProvider from "../ServiceProvider";
import history from "../route/History";
import { Add } from "./add/Add";
import { RightBar } from "./bar/RightBar";
import { BarItem } from "./bar/BarItem";
import { Dictionary } from "./dict/Dictionary";
import { Review } from "./review/Review";

export const Menu = function () {
  const [activeMenuItem, setActiveMenuItem] = useState("Library");
  const [bookId, setBookId] = useState<number | undefined>(undefined);
  const [initiated, setInitiated] = useState(false);

  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: MenuItemProps
  ): void => {
    setActiveMenuItem(data.name as string);

    if (data.name === "Library") {
      history.push("/");
    } else if (data.name === "Book") {
      history.push("/book" + (bookId !== undefined ? "/" + bookId : ""));
    } else if (data.name === "Add") {
      history.push("/add" + (bookId !== undefined ? "/" + bookId : ""));
    }
  };

  useEffect(() => {
    async function innerFunction() {
      const firstBook = await serviceProvider.bookService.getFirstBook();
      const firstBookId = firstBook == undefined ? undefined : firstBook.id;
      setBookId(firstBookId);
      setInitiated(true);
    }
    innerFunction();
  }, [serviceProvider.bookService, bookId, initiated]);

  if (!initiated) {
    return <></>;
  }

  return (
    <Grid>
      <Grid.Column width={2}>
        <SemanticMenu fluid vertical tabular>
          <SemanticMenu.Item
            name={"Library"}
            active={activeMenuItem === "Library"}
            onClick={handleItemClick}
          />
          <SemanticMenu.Item
            name={"Book"}
            active={activeMenuItem === "Book"}
            onClick={handleItemClick}
          />
          <SemanticMenu.Item
            name={"Add"}
            active={activeMenuItem === "Add"}
            onClick={handleItemClick}
          />
          <SemanticMenu.Item
            name={"Review"}
            active={activeMenuItem === "Review"}
            onClick={handleItemClick}
          />
        </SemanticMenu>
      </Grid.Column>
      <Grid.Column width={8}>
        <Segment>
          <HashRouter>
            <Switch>
              <Route path={"/"} component={Library} exact />
              <Route path={"/book/:bookId"} component={Book} />
              <Route path={"/add/:bookId"} component={Add} />
              <Route path={"/review/:bookId"} component={Review} />
            </Switch>
          </HashRouter>
        </Segment>
      </Grid.Column>
      <Grid.Column stretched width={2}>
        <RightBar>
          <BarItem icon={"book"} component={<Dictionary />} />
        </RightBar>
      </Grid.Column>
    </Grid>
  );
};
