import { RepositoryFactory } from "../RepositoryFactory";
import { ObjectType, Repository } from "../Repository";
import { Connection, ConnectionOptions, createConnection } from "typeorm";
import * as os from "os";
import * as path from "path";
import { TypeOrmRepository } from "./TypeOrmRepository";

export class TypeOrmRepositoryFactory implements RepositoryFactory {
  private connection: Connection | undefined;

  private repositories: Map<any, any> = new Map();

  async getRepository<Entity>(
    target: ObjectType<Entity>
  ): Promise<Repository<Entity>> {
    if (
      this.repositories.has(target) &&
      this.repositories.get(target) !== undefined
    ) {
      return this.repositories.get(target) as Repository<Entity>;
    }
    const connection = await this.getConnection();
    const innerRepository = connection.getRepository(target);
    const repository = new TypeOrmRepository(innerRepository);
    this.repositories.set(target, repository);
    return repository;
  }

  private async getConnection(): Promise<Connection> {
    if (this.connection !== undefined) {
      return this.connection;
    }
    const options: ConnectionOptions = {
      type: "sqlite",
      database: path.join(os.homedir(), ".my-vocabulary", "vocabulary.db"),
      entities: ["../entity/**/*.ts"],
      logging: true,
    };
    return await createConnection(options);
  }
}
