import { CardFacade } from "./../facade/CardFacade";
export const TYPES = {
  DatabaseService: Symbol.for("DatabaseService"),
  BookService: Symbol.for("BookService"),
  WordService: Symbol.for("WordService"),
  RepositoryFactory: Symbol.for("RepositoryFactory"),
  ConfigRepository: Symbol.for("ConfigRepository"),
  CardTypeRepository: Symbol.for("CardTypeRepository"),
  CardRepository: Symbol.for("CardRepository"),
  FieldTypeRepository: Symbol.for("FieldTypeRepository"),
  FieldRepository: Symbol.for("FieldRepository"),
  CardFacade: Symbol.for("CardFacadeA"),
};
