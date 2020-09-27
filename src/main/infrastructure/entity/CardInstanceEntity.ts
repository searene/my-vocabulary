import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class CardInstanceEntity extends BaseEntity {
  @ManyToOne(type => Composition)
  composition: Composition | undefined;
}
