import { ObjectType, Repository } from "./Repository";

export interface RepositoryFactory {
  getRepository<Entity>(
    target: ObjectType<Entity>
  ): Promise<Repository<Entity>>;
}
