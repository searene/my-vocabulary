import { injectable } from "@parisholley/inversify-async";
import { container } from "../config/inversify.config";
import { types } from "../config/types";
import { ConfigReader } from "../ConfigReader";
import { ConfigService } from "./ConfigService";

@injectable()
export class ConfigServiceImpl implements ConfigService {

    async isAutoPronunciationWhenReview(): Promise<boolean> {
        const configReader = await container.getAsync<ConfigReader>(ConfigReader);
        return configReader.getBoolean("autoPronunciation");
    }
    
}
