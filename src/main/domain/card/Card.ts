import { RepositoryFactory } from "../../infrastructure/repository/RepositoryFactory";
import { TypeOrmRepository } from "../../infrastructure/repository/typeOrm/TypeOrmRepository";
import { TypeOrmRepositoryFactory } from "../../infrastructure/repository/typeOrm/TypeOrmRepositoryFactory";
import { CardEntity } from "../../infrastructure/entity/CardEntity";
import { repositoryFactory } from "../../config/bind";
import { ConfigEntity } from "../../infrastructure/entity/ConfigEntity";
import { Entity } from "typeorm";

export class Card {
  private id: number | undefined;

  private constructor(
    private bookId: number,
    private cardType: CardType,
    private fields: Field[]
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
}
