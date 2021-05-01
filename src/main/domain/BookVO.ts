import { container } from "../config/inversify.config";
import { types } from "../config/types";
import { BookDO } from "../infrastructure/do/BookDO";
import { CardInstanceRepository } from "../infrastructure/repository/CardInstanceRepository";
import { CardRepository } from "../infrastructure/repository/CardRepository";

export type BookVO = {
  id: number;
  name: string;
  totalWordCount: number;
  dueCardInstanceCount: number;
  todayAddedCardCount: number;
};

export async function convertBookDOToBookVO(bookDO: BookDO): Promise<BookVO> {
  const cardInstanceRepo = await container.getAsync<CardInstanceRepository>(types.CardInstanceRepository);
  const dueCardInstanceCount = await cardInstanceRepo.queryDueCardInstanceCount(bookDO.id as number);
  const cardRepo = await container.getAsync<CardRepository>(types.CardRepository);
  const todayAddedCardCount = await cardRepo.getTodayAddedCardCount(bookDO.id as number);
  return {
    id: bookDO.id as number,
    name: bookDO.name as string,
    totalWordCount: (bookDO.contents as string).split(/\s/).length,
    dueCardInstanceCount,
    todayAddedCardCount,
  };
}
