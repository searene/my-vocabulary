import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The name of the book.
   */
  @Column()
  name: string;

  /**
   * The plain contents of the book.
   */
  @Column()
  contents: string;
}
