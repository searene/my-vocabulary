import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import serviceProvider from "../../ServiceProvider";

interface BookNameProps {
  bookId: number;
}
export const BookName = (props: BookNameProps) => {
  const [bookName, setBookName] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchBookName() {
      if (bookName === "") {
        const bookVO = await serviceProvider.bookService.getBook(props.bookId);
        setBookName(bookVO.name);
      }
    }
    fetchBookName();
  }, [props.bookId, dispatch]);

  return <div>{bookName}</div>;
};
