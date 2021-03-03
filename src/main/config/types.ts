import { CardFacade } from "../facade/CardFacade";
export const types = {
  BookService: Symbol.for("BookService"),
  WordService: Symbol.for("WordService"),
  RepositoryFactory: Symbol.for("RepositoryFactory"),
  ConfigRepository: Symbol.for("ConfigRepository"),
  CardTypeRepository: Symbol.for("CardTypeRepository"),
  CardRepository: Symbol.for("CardRepository"),
  CardInstanceRepository: Symbol.for("CardInstanceRepository"),
  ReviewRepository: Symbol.for("ReviewRepository"),
  FieldTypeRepository: Symbol.for("FieldTypeRepository"),
  FieldRepository: Symbol.for("FieldRepository"),
  WordRepository: Symbol.for("WordRepository"),
  CompositionRepository: Symbol.for("CompositionRepository"),
  CompositeRepository: Symbol.for("CompositeRepository"),
  BookRepository: Symbol.for("BookRepository"),
  CardFacade: Symbol.for("CardFacade"),
  DictService: Symbol.for("DictService"),
  Scheduler: Symbol.for("Scheduler"),
  ImportKnownWordsService: Symbol.for("ImportKnownWordsService"),
};
