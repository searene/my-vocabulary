import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import serviceProvider from "../../ServiceProvider";
import { refreshBookName, selectBookName } from "../book/bookSlice";

interface BookNameProps {
  bookId: number;
}
export const BookName = (props: BookNameProps) => {
  const bookName = useSelector(selectBookName);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshBookName());
  }, [props.bookId, dispatch]);

  return <span>{bookName}</span>;
};
