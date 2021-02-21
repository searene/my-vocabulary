import { injectable } from "@parisholley/inversify-async";
import {
  BrowseData,
  CardFacade,
  CardInstanceVO,
  FieldTypeVO, ReviewItem,
  ReviewRequest,
  SaveCardParam,
} from "./CardFacade";
import { CardFactory } from "../domain/card/factory/CardFactory";
import { FieldTypeFactory } from "../domain/card/factory/FieldTypeFactory";
import { FieldFactory } from "../domain/card/factory/FieldFactory";
import { types } from "../config/types";
import { WordStatus } from "../enum/WordStatus";
import { WordRepository } from "../infrastructure/repository/WordRepository";
import { container } from "../config/inversify.config";
import { Scheduler } from "../domain/scheduler/Scheduler";
import { CardInstanceRepository } from "../infrastructure/repository/CardInstanceRepository";
import { CardInstance } from "../domain/card/instance/CardInstance";
import { CompositionRepository } from "../infrastructure/repository/CompositionRepository";
import { ReviewRepository } from "../infrastructure/repository/ReviewRepository";
import {
  addTimeInterval,
  convertTimeIntervalToString,
} from "../domain/time/TimeInterval";
import { FieldRepository } from "../infrastructure/repository/FieldRepository";
import { CardRepository } from "../infrastructure/repository/CardRepository";
import { FieldDO } from "../infrastructure/do/FieldDO";
import { BookRepository } from "../infrastructure/repository/BookRepository";

@injectable()
export class CardFacadeImpl implements CardFacade {
  private _cardFactory = new CardFactory();
  private _fieldTypeFactory = FieldTypeFactory.get();
  private _fieldFactory = FieldFactory.get();

  async getFieldTypes(cardTypeId?: number): Promise<FieldTypeVO[]> {
    const fieldTypes = await this._fieldTypeFactory.getFieldTypes(cardTypeId);
    return fieldTypes.map((fieldType) => {
      return {
        id: fieldType.id,
        category: fieldType.category,
        name: fieldType.name,
      };
    });
  }

  async saveCard(saveCardParam: SaveCardParam): Promise<number> {
    const card = await this._cardFactory.createCard(saveCardParam.bookId,
      saveCardParam.word);
    await this._fieldFactory.batchCreate(card.id, saveCardParam.fieldContents);

    // create card instances
    const compositionRepo = await container.getAsync<CompositionRepository>(
      types.CompositionRepository
    );
    const compositionDOs = await compositionRepo.query({
      cardTypeId: card.cardType.id,
    });
    const scheduler = await container.getAsync<Scheduler>(types.Scheduler);
    const cardInstanceDOs = compositionDOs.map((compositionDO) => {
      return {
        cardId: card.id,
        compositionId: compositionDO.id,
        dueTime: scheduler.getInitialReviewDate().getTime(),
        bookId: saveCardParam.bookId,
      };
    });
    const cardInstanceRepo = await container.getAsync<CardInstanceRepository>(
      types.CardInstanceRepository
    );
    await cardInstanceRepo.batchInsert(cardInstanceDOs);

    const wordRepository = await this.getWordRepository();
    await wordRepository.updateByWord({
      word: saveCardParam.word,
      status: WordStatus.Known,
    });
    return card.id;
  }

  private async getWordRepository(): Promise<WordRepository> {
    return container.getAsync(types.WordRepository);
  }

  async getNextReviewCardInstanceByBookId(
    bookId: number
  ): Promise<CardInstanceVO | undefined> {
    const cardInstanceRepository = await container.getAsync<
      CardInstanceRepository
    >(types.CardInstanceRepository);
    const dueCardInstanceDO = await cardInstanceRepository.queryNextDueCardInstance(
      bookId
    );
    if (dueCardInstanceDO == undefined) {
      return undefined;
    }
    const dueCardInstance = await CardInstance.fromCardInstanceDO(
      dueCardInstanceDO
    );
    const scheduler = container.get<Scheduler>(types.Scheduler);
    const reviewTimeRecord = await scheduler.getNextReviewTimeRecord(
      dueCardInstance
    );
    const contents = await dueCardInstance.getFrontAndBackContents();
    return {
      id: dueCardInstance.id,
      front: contents[0],
      back: contents[1],
      reviewTimeRecord: reviewTimeRecord,
    };
  }

  async review(reviewRequest: ReviewRequest): Promise<void> {
    const reviewRepo = await container.getAsync<ReviewRepository>(
      types.ReviewRepository
    );
    await reviewRepo.insert({
      cardInstanceId: reviewRequest.cardInstanceId,
      reviewTime: new Date().getTime(),
      level: reviewRequest.level,
      timeInterval: convertTimeIntervalToString(reviewRequest.timeInterval),
    });

    const cardInstanceRepo = await container.getAsync<CardInstanceRepository>(
      types.CardInstanceRepository
    );
    await cardInstanceRepo.updateById({
      id: reviewRequest.cardInstanceId,
      dueTime: addTimeInterval(new Date(), reviewRequest.timeInterval).getTime(),
    });
  }

  async getBrowseData(offset: number, limit: number): Promise<BrowseData> {
    const cardInstanceRepo = await container.getAsync<CardInstanceRepository>(types.CardInstanceRepository);
    const cardInstanceDOs = await cardInstanceRepo.query({}, { offset, limit });
    const cardRepo = await container.getAsync<CardRepository>(types.CardRepository);
    const cardDOs = await cardRepo.batchQueryByIds(cardInstanceDOs.map(cardInstanceDO => cardInstanceDO.cardId as number));
    const bookRepo = await container.getAsync<BookRepository>(types.BookRepository);
    const bookDOs = await bookRepo.batchQueryByIds(cardDOs.map(cardDO => cardDO.bookId as number));
    const fieldRepo = await container.getAsync<FieldRepository>(types.FieldRepository);
    const fieldDOs: FieldDO[] = await fieldRepo.batchQueryByCardIds(cardDOs.map(cardDO => cardDO.id as number));
    const reviewItems: ReviewItem[] = [];
    for (const cardInstanceDO of cardInstanceDOs) {
      const cardInstanceId = cardInstanceDO.id as number;
      const cardDO = cardDOs.filter(cardDO => cardDO.id === cardInstanceDO.cardId)[0];
      const word = cardDO.word as string;
      const bookName = bookDOs.filter(bookDO => cardDO.bookId === bookDO.id)[0].name as string;
      const firstFieldDO = fieldDOs.filter(fieldDO => fieldDO.cardId === cardDO.id)[0];
      const firstFieldId = firstFieldDO.id as number;
      const firstFieldContents = firstFieldDO.contents as string;
      const dueTime = cardInstanceDO.dueTime as number;
      reviewItems.push({ cardInstanceId, firstFieldId, firstFieldContents, word, bookName, dueTime });
    }
    const totalCount = await cardInstanceRepo.queryCount({});
    return { reviewItems, totalCount };
  }
}
