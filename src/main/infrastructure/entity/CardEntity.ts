import { BaseEntity } from "./BaseEntity";
import { Column, ManyToOne, OneToMany } from "typeorm";
import { CardTypeEntity } from "./CardTypeEntity";
import { FieldEntity } from "./FieldEntity";

export class CardEntity extends BaseEntity {
  @Column()
  bookId: number | undefined;

  @ManyToOne(type => CardTypeEntity)
  cardTypeEntity: CardTypeEntity | undefined;

  @OneToMany(
    type => FieldEntity,
    fieldEntity => fieldEntity.cardEntity
  )
  fieldEntities: FieldEntity[] | undefined;
}
