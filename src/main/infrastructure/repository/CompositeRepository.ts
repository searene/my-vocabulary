import { BrowseData, BrowseDataRequest } from "../../facade/CardFacade";

export interface CompositeRepository {
  init(): Promise<void>;
  getBrowseData(browseDataRequest: BrowseDataRequest): Promise<BrowseData>;
}