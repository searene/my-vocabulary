import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { CompositionRepository } from "../../../infrastructure/repository/CompositionRepository";
import { Composition } from "../Composition";
import { FieldType } from "../FieldType";

export class CompositionFactory {
  private static _instance: CompositionFactory | undefined;

  private constructor() {}

  async createSimpleComposition(
    frontFieldType: FieldType,
    backFieldType: FieldType
  ): Promise<Composition> {
    const compositionRepository = await this.getCompositionRepository();
    const compositions = await compositionRepository.query({
      cardTypeId: frontFieldType.cardType.id,
    });
    if (compositions.length > 1) {
      return await Composition.fromCompositionDO(compositions[0]);
    }
    const compositionDO = await compositionRepository.insert({
      name: "simple",
      frontTypeIds: `${frontFieldType.id}`,
      backTypeIds: `${backFieldType.id}`,
      cardTypeId: frontFieldType.cardType.id,
    });
    return await Composition.fromCompositionDO(compositionDO);
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
