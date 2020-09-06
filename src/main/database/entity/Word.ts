import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The related book id
   */
  @Column()
  bookId: number;

  /**
   * Word
   */
  @Column()
  word: string;

  /**
   * Positions of the word in the book, separated by commas if there are multiple.
   */
  @Column()
  positions: string;
}
