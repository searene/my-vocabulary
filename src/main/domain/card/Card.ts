import { CardEntity } from "../../infrastructure/entity/CardEntity";
import { repositoryFactory } from "../../config/bind";
import { ConfigEntity } from "../../infrastructure/entity/ConfigEntity";
import { CardType } from "./CardType";

export class Card {
  private id: number | undefined;

  private constructor(
    private _bookId: number,
    private _cardType: CardType,
    private _fields: Field[]
  ) {}

  /**
   * Create an empty Card instance, this card hasn't been saved into database
   * yet, and Card::id is undefined
   */
  static async createEmptyCard(bookId: number): Promise<Card> {
    const configRepository = await repositoryFactory.getRepository(
      ConfigEntity
    );
    const configEntity = await configRepository.findOne();
    if (configEntity === undefined) {
      console.error("configEntity is undefined");
      throw new Error("configEntity is undefined");
    }
    return new Card(bookId, configEntity.defaultCardType as CardType, []);
  }

  /**
   * Save the current Card into db, and id of the returned Card instance will
   * be filled. This method will not modify the current Card instance.
   */
  async save(): Promise<Card> {
    const cardRepository = await repositoryFactory.getRepository(CardEntity);
    const cardEntity = new CardEntity();
    await cardRepository.save([this]);
  }

  public get cardType(): CardType {
    return this._cardType;
  }
  public get bookId(): number {
    return this._bookId;
  }
  public get fields(): Field[] {
    return this._fields;
  }
}
