import { TypeOrmRepositoryFactory } from "../infrastructure/repository/typeOrm/TypeOrmRepositoryFactory";
import { RepositoryFactory } from "../infrastructure/repository/RepositoryFactory";

const repositoryFactory: RepositoryFactory = new TypeOrmRepositoryFactory();
export { repositoryFactory };
