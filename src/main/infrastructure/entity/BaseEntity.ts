import { Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;
}
