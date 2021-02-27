import { injectable } from "@parisholley/inversify-async";
import {
  BrowseData, BrowseDataRequest,
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
import { CompositeRepository } from "../infrastructure/repository/CompositeRepository";

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

  async getBrowseData(request: BrowseDataRequest): Promise<BrowseData> {
    const compositeRepo = await container.getAsync<CompositeRepository>(types.CompositeRepository);
    return compositeRepo.getBrowseData(request);
  }
}
