import { injectable } from "@parisholley/inversify-async";
import {
  CardFacade,
  CardInstanceVO,
  FieldTypeVO,
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
        name: fieldType.name,
      };
    });
  }

  async saveCard(saveCardParam: SaveCardParam): Promise<number> {
    const card = await this._cardFactory.createCard(saveCardParam.bookId);
    await this._fieldFactory.batchCreate(card.id, saveCardParam.fieldContents);
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
    const cardInstanceRepository = container.get<CardInstanceRepository>(
      types.CardInstanceRepository
    );
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
    const reviewTimeMap = await scheduler.getNextReviewTimeMap(dueCardInstance);
  }
}
