import { injectable } from "@parisholley/inversify-async";
import {
  BrowseData, BrowseDataRequest,
  CardFacade,
  FieldTypeVO,
  ReviewRequest,
  SaveCardParam,
} from "./CardFacade";
import { CardFactory } from "../domain/card/factory/CardFactory";
import { FieldTypeFactory } from "../domain/card/factory/FieldTypeFactory";
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
import { CompositeRepository } from "../infrastructure/repository/CompositeRepository";
import { Field } from "../domain/field/Field";
import { FieldVO } from "./vo/FieldVO";
import { FieldContents } from "../domain/card/FieldContents";
import { CardInstanceFactory } from "../domain/card/instance/CardInstanceFactory";
import { CardInstanceVO, fromCardInstance } from "./vo/CardInstanceVO";

@injectable()
export class CardFacadeImpl implements CardFacade {
  private _cardFactory = new CardFactory();
  private _fieldTypeFactory = FieldTypeFactory.get();

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

  async addCard(saveCardParam: SaveCardParam): Promise<number> {
    const card = await this._cardFactory.createCard(saveCardParam.bookId,
      saveCardParam.word);
    await Field.batchCreate(card.id, saveCardParam.fieldContents);

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
      status: WordStatus.KNOWN,
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
    return await fromCardInstance(dueCardInstance);
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
    const scheduler = await container.getAsync<Scheduler>(types.Scheduler);
    await scheduler.processAfterAnswer(reviewRequest.cardInstanceId, reviewRequest.level);
  }

  async getBrowseData(request: BrowseDataRequest): Promise<BrowseData> {
    const compositeRepo = await container.getAsync<CompositeRepository>(types.CompositeRepository);
    return compositeRepo.getBrowseData(request);
  }

  async getFieldTypeIdToFieldVOMap(cardInstanceId: number): Promise<Record<number, FieldVO>> {

    const fields = await Field.fromCardInstanceId(cardInstanceId);
    const result: Record<number, FieldVO> = {};
    for (const field of fields) {
      result[field.fieldType.id] = {
        fieldTypeId: field.fieldType.id,
        category: field.fieldType.category,
        name: field.fieldType.name,
        originalContents: field.originalContents,
        plainTextContents: field.plainTextContents,
      }
    }
    return result;
  }

  async editCard(cardInstanceId: number, fieldTypeIdToFieldContentsMap: Record<number, FieldContents>): Promise<void> {
    const fields: Field[] = await Field.fromCardInstanceId(cardInstanceId);
    for (const field of fields) {
      const fieldContents: FieldContents = fieldTypeIdToFieldContentsMap[field.fieldType.id];
      await field.updateFieldContents(fieldContents.originalContents, fieldContents.plainTextContents);
    }
  }

  async getCardInstanceById(cardInstanceId: number): Promise<CardInstanceVO> {
    const cardInstance = await CardInstanceFactory.queryById(cardInstanceId);
    if (cardInstance === undefined) {
      throw new Error("CardInstance doesn't exit, id: " + cardInstanceId);
    }
    return await fromCardInstance(cardInstance);
  }
}
