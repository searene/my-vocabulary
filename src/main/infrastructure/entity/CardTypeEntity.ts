import { BaseEntity } from "./BaseEntity";
import { Column, Entity, OneToMany } from "typeorm";
import { CardEntity } from "./CardEntity";

@Entity()
export class CardTypeEntity extends BaseEntity {
  @Column()
  name: string | undefined;

  @OneToMany(
    type => CardEntity,
    cardEntity => cardEntity.cardTypeEntity
  )
  cardEntities: CardEntity[] | undefined;
}
