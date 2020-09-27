import { BaseEntity, Entity } from "typeorm";

@Entity()
export class CompositionEntity extends BaseEntity {
  /**
   * Comma-separated field ids.
   */
  frontFieldIdList: string | undefined;

  /**
   * Comma-separated field ids.
   */
  backFieldIdList: string | undefined;
}
