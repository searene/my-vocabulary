import { CompositeRepository } from "../CompositeRepository";
import { BrowseData, BrowseDataRequest, ReviewItem } from "../../../facade/CardFacade";
import { knex } from "./KnexFactory";
import { injectable } from "@parisholley/inversify-async";
import { CardInstance } from "../../../domain/card/instance/CardInstance";
import { container } from "../../../config/inversify.config";
import { types } from "../../../config/types";

@injectable()
export class KnexCompositeRepository implements CompositeRepository {
  async getBrowseData(browseDataRequest: BrowseDataRequest): Promise<BrowseData> {
    let subQuery = knex("card_instances")
      .join("cards", "card_instances.card_id", "=", "cards.id")
      .join("fields", "fields.card_id", "=", "cards.id")
      .join("books", "books.id", "=", "cards.book_id")
      .select("card_instances.id as card_instance_id",
        "card_instances.due_time as due_time",
        "fields.id as field_id",
        "fields.plain_text_contents as field_contents",
        "cards.word as word",
        "books.name as book_name",
        knex.raw("ROW_NUMBER() OVER (PARTITION BY card_instances.id ORDER BY fields.field_type_id) as r")
      );

    if (browseDataRequest.searchContents !== undefined) {
      subQuery = subQuery
        .where("cards.word", "like", `%${browseDataRequest.searchContents}%`)
        .orWhere("fields.original_contents", "like", `%${browseDataRequest.searchContents}%`);
    }

    const outerCommonQuery = knex(subQuery)
      .where("r", "=", 1);
    const outerDataQuery = outerCommonQuery
      .select("card_instance_id",
        "due_time",
        "field_id as first_field_id",
        "field_contents as first_field_contents",
        "word",
        "book_name")
      .limit(browseDataRequest.limit)
      .offset(browseDataRequest.offset)
    const reviewItems = await outerDataQuery as ReviewItem[];
    const totalCountQuery = outerCommonQuery.count("* as cnt").first() as any;
    const totalCount = (await totalCountQuery)["cnt"];

    // When totalCount == 0, reviewItems is an array one element, where each field is null.
    // This is a problem of Sqlite3, haven't found a solution yet, let's just manually return
    // empty array in this case.
    return totalCount === 0 ? { reviewItems: [] , totalCount: 0 } : {reviewItems, totalCount};
  }

  async init(): Promise<void> {
    // container will invoke respective init(), which would enable respective createTableIfNotExists
    await container.getAsync(types.CardInstanceRepository);
    await container.getAsync(types.CardRepository);
    await container.getAsync(types.FieldRepository);
    await container.getAsync(types.BookRepository);
  }
}