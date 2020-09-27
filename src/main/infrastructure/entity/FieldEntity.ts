import { BaseEntity } from "./BaseEntity";
import { Column, Entity, ManyToOne } from "typeorm";
import { CardEntity } from "./CardEntity";

@Entity()
export class FieldEntity extends BaseEntity {
  @ManyToOne(
    type => CardEntity,
    cardEntity => cardEntity.fieldEntities
  )
  cardEntity: CardEntity | undefined;

  @Column()
  contents: string | undefined;
}
