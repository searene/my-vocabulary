import { CompositeRepository } from "../CompositeRepository";
import { BrowseData, BrowseDataRequest, ReviewItem } from "../../../facade/CardFacade";
import { knex } from "./KnexFactory";
import { injectable } from "@parisholley/inversify-async";

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
        "fields.contents as field_contents",
        "cards.word as word",
        "books.name as book_name"
        )
      .groupBy("card_instances.id");

    if (browseDataRequest.searchContents !== undefined) {
      subQuery = subQuery.where("cards.word", "like", `%${browseDataRequest.searchContents}%`)
        .orWhere("fields.contents", "like", `%${browseDataRequest.searchContents}%`);
    }
    const outerDataQuery = knex(subQuery)
      .select("card_instance_id")
      .max({
        due_time: "due_time",
        field_id: "field_id",
        field_contents: "field_contents",
        word: "word",
        book_name: "book_name"
      })
      .limit(browseDataRequest.limit)
      .offset(browseDataRequest.offset)
    const reviewItems = await outerDataQuery as ReviewItem[];
    const totalCountQuery = knex(subQuery).count("* as cnt").first() as any;
    const totalCount = (await totalCountQuery)["cnt"];

    // When totalCount == 0, reviewItems is an array one element, where each field is null.
    // This is a problem of Sqlite3, haven't found a solution yet, let's just manually return
    // empty array in this case.
    return totalCount === 0 ? { reviewItems: [] , totalCount: 0 } : {reviewItems, totalCount};
  }
}