import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { CompositionDO } from "../../../infrastructure/do/CompositionDO";
import { CompositionRepository } from "../../../infrastructure/repository/CompositionRepository";
import { Composition } from "../Composition";
import { FieldType } from "../FieldType";

export class CompositionFactory {
  private static _instance: CompositionFactory | undefined;

  private constructor() {}

  async createInitialComposition(
    frontFieldType: FieldType,
    backFieldType: FieldType
  ): Promise<Composition> {
    const compositionRepository = await this.getCompositionRepository();
    const compositions = await compositionRepository.query({
      cardTypeId: frontFieldType.cardTypeId,
    });
    if (compositions.length > 1) {
      return this.fromCompositionDO(compositions[0]);
    }
    const compositionDO = await compositionRepository.insert({
      name: "normal",
      frontTypeIds: `${frontFieldType.id}`,
      backTypeIds: `${backFieldType.id}`,
      cardTypeId: frontFieldType.cardTypeId,
    });
    return this.fromCompositionDO(compositionDO);
  }

  private fromCompositionDO(compositionDO: CompositionDO): Composition {
    return Composition.build(
      compositionDO.id as number,
      compositionDO.name as string,
      compositionDO.cardTypeId as number,
      compositionDO.frontTypeIds as string,
      compositionDO.backTypeIds as string
    );
  }

  private async getCompositionRepository(): Promise<CompositionRepository> {
    return await container.getAsync(types.CompositionRepository);
  }

  static async get() {
    if (this._instance === undefined) {
      this._instance = new CompositionFactory();
    }
    return this._instance;
  }
}
