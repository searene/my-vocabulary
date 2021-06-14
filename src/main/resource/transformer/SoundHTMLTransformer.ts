import { HTMLTransformer } from "./HTMLTransformer";
import * as cheerio from 'cheerio';
import { container } from "../../config/inversify.config";
import { DictService } from "../../dict/DictService";
import { types } from "../../config/types";
import { ResourceService } from "../ResourceService";

export class SoundHTMLTransformer implements HTMLTransformer {

    async transformHTML(html: string): Promise<string> {
        const $ = cheerio.load(html);
        let p = Promise.resolve();
        const resourceService = container.get<ResourceService>(types.ResourceService);
        $('img')
            .filter(".audio-img")
            .each(function(i, elem) {
                const dictId = parseInt($(this).data("dp-dict-id") as string);
                const resourceName = $(this).data("dp-resource-name") as string;
                p = p.then(() => resourceService.saveSound(dictId, resourceName))
                     .then(resourceInfo => {
                         $(this).attr("onclick", `return playInternalAudio("${resourceInfo.internalLink}", "${resourceInfo.mimeType.toString()}")`);
                         $(this).removeAttr("data-dp-dict-id");
                         $(this).removeAttr("data-dp-resource-name");
                         return Promise.resolve();
                     });
            });
        await p;
        return $.html();
    }
}