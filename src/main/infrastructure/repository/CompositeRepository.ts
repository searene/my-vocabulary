import { BrowseData, BrowseDataRequest } from "../../facade/CardFacade";

export interface CompositeRepository {
  getBrowseData(browseDataRequest: BrowseDataRequest): Promise<BrowseData>;
}