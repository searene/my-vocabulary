import { CardInstance } from "./CardInstance";
import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";
import { CardInstanceRepository } from "../../../infrastructure/repository/CardInstanceRepository";

export class CardInstanceFactory {
  static async queryById(
    cardInstanceId: number
  ): Promise<CardInstance | undefined> {
    const cardInstanceRepository: CardInstanceRepository = await container.getAsync(
      types.CardInstanceRepository
    );
    const cardInstanceDO = await cardInstanceRepository.queryByIdOrThrow(
      cardInstanceId
    );
    return await CardInstance.fromCardInstanceDO(cardInstanceDO);
  }
}
