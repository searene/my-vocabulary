import { Repository } from "../Repository";
import { Repository as InnerRepository } from "typeorm";

export class TypeOrmRepository<Entity> implements Repository<Entity> {
  constructor(private innerRepository: InnerRepository<Entity>) {}

  async save(entity: Entity): Promise<Entity> {
    return this.innerRepository.save(entity);
  }

  async save(entities: Entity[]): Promise<Entity[]> {
    return this.innerRepository.save(entities);
  }

  async findOne(id?: string | number): Promise<Entity | undefined> {
    return this.innerRepository.findOne(id);
  }
}
