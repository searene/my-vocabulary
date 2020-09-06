import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The related book id
   */
  @Column("int", { nullable: false, name: "book_id" })
  bookId: number;

  /**
   * Word
   */
  @Column("text", { nullable: true })
  word: string;

  /**
   * Positions of the word in the book, separated by commas if there are multiple.
   */
  @Column("text", { nullable: true })
  positions: string;

  @Column("int", { nullable: false })
  status: number;
}
