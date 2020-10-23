import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { CompositionDO } from "../../../infrastructure/do/CompositionDO";
import { CompositionRepository } from "../../../infrastructure/repository/CompositionRepository";
import { Composition } from "../Composition";
import { FieldType } from "../FieldType";

export class CompositionFactory {
  async createInitialComposition(
    frontFieldType: FieldType,
    backFieldType: FieldType
  ): Promise<Composition> {
    const compositionRepository = await this.getCompositionRepository();
    const compositionDO = await compositionRepository.insert({
      name: "normal",
      front: `${frontFieldType.id}`,
      back: `${backFieldType.id}`,
      cardTypeId: frontFieldType.cardTypeId,
    });
    return this.fromCompositionDO(compositionDO);
  }

  private fromCompositionDO(compositionDO: CompositionDO): Composition {
    return Composition.build(
      compositionDO.id as number,
      compositionDO.name as string,
      compositionDO.cardTypeId as number,
      compositionDO.front as string,
      compositionDO.back as string
    );
  }

  private async getCompositionRepository(): Promise<CompositionRepository> {
    return await container.getAsync(types.CompositionRepository);
  }
}
