import { BaseEntity } from "./BaseEntity";
import { Column, Entity } from "typeorm";

@Entity()
export class ConfigEntity extends BaseEntity {
  /**
   * Default card type to use when adding new cards.
   */
  @Column(type => CardType)
  defaultCardType: CardType | undefined;
}
