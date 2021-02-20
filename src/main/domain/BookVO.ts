import { BookDO } from "../infrastructure/do/BookDO";

export type BookVO = {
  id: number;
  name: string;
  totalWordCount: number;
};

export function convertBookDOToBookVO(bookDO: BookDO): BookVO {
  return {
    id: bookDO.id as number,
    name: bookDO.name as string,
    totalWordCount: (bookDO.contents as string).split(/\s/).length,
  };
}
