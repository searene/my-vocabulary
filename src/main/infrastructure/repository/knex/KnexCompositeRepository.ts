import { CompositeRepository } from "../CompositeRepository";
import { BrowseData, BrowseDataRequest, ReviewItem } from "../../../facade/CardFacade";
import { knex } from "./KnexFactory";

export class KnexCompositeRepository implements CompositeRepository {
  async getBrowseData(browseDataRequest: BrowseDataRequest): Promise<BrowseData> {
    const subQuery = knex("card_instances")
      .join("cards", "card_instances.card_id", "=", "cards.id")
      .join("fields", "fields.card_id", "=", "cards.id")
      .join("books", "books.id", "=", "cards.book_id")
      .select("card_instances.id as card_instance_id",
        "card_instances.due_time as due_time",
        "fields_id as field_id",
        "cards.word as word",
        "books.name as book_name"
        )
      .where("cards.word", "like", `%${browseDataRequest.searchContents}%`)
      .orWhere("fields.contents", "like", `%${browseDataRequest.searchContents}%`)
      .groupBy("card_instances.id")
    const outerDataQuery = knex(subQuery)
      .select("card_instances.id as card_instance_id")
      .max({
        due_time: "due_time",
        field_id: "field_id",
        field_contents: "field_contents",
        word: "word",
        book_name: "book_name"
      })
      .limit(browseDataRequest.limit)
      .offset(browseDataRequest.offset)
    console.log(outerDataQuery.toSQL().toNative());
    return {
      reviewItems: [],
      totalCount: 100
    };
    // const dataRows = await outerDataQuery;
    // const reviewItems: ReviewItem[] = (await outerDataQuery).map(dataRow => {
    //   cardInstanceId: dataRow.card_instance_id as number,
    //
    // })
  }
}