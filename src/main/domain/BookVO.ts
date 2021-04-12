import { container } from "../config/inversify.config";
import { types } from "../config/types";
import { BookDO } from "../infrastructure/do/BookDO";
import { CardInstanceRepository } from "../infrastructure/repository/CardInstanceRepository";

export type BookVO = {
  id: number;
  name: string;
  totalWordCount: number;
  dueCardInstanceCount: number;
};

export async function convertBookDOToBookVO(bookDO: BookDO): Promise<BookVO> {
  const cardInstanceRepo = await container.getAsync<CardInstanceRepository>(types.CardInstanceRepository);
  const dueCardInstanceCount = await cardInstanceRepo.queryDueCardInstanceCount(bookDO.id as number);
  return {
    id: bookDO.id as number,
    name: bookDO.name as string,
    totalWordCount: (bookDO.contents as string).split(/\s/).length,
    dueCardInstanceCount,
  };
}
