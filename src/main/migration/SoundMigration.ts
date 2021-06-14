import { container } from "../config/inversify.config";
import { types } from "../config/types";
import { FieldRepository } from "../infrastructure/repository/FieldRepository";
import * as cheerio from 'cheerio';
import { ResourceService } from "../resource/ResourceService";

export async function migrate() {
  const fieldRepo = await container.getAsync<FieldRepository>(types.FieldRepository);
  const fieldDOArray = (await fieldRepo.query({}))
      .filter(fieldDO => fieldDO.originalContents?.indexOf("Media.playAudio") !== -1);
  for (const fieldDO of fieldDOArray) {
    fieldDO.originalContents = await transform(fieldDO.originalContents as string);
    console.log("update fieldDO: " + fieldDO);
    fieldRepo.updateById(fieldDO);
  }
}

async function transform(html: string) {
  console.log("__________________________________");
  console.log(html);
  const $ = cheerio.load(html);
  let p = Promise.resolve();
  const resourceService = container.get<ResourceService>(types.ResourceService);
  const QUOTE = "\"";
  $('img')
      .filter(".audio-img")
      .each(function(i, elem) {
        const onclick = $(this).attr("onclick") as string;
        if (onclick.indexOf("mc://") !== -1) {
          return;
        }
        const firstQuotePos = onclick.indexOf(QUOTE);
        const secondQuotePos = onclick.indexOf(QUOTE, firstQuotePos + QUOTE.length);
        const thirdQuotePos = onclick.indexOf(QUOTE, secondQuotePos + QUOTE.length);
        const fourthQuotePos = onclick.indexOf(QUOTE, thirdQuotePos + QUOTE.length);
        const dictId = parseInt(onclick.substring(firstQuotePos + QUOTE.length, secondQuotePos));
        const resourceName = onclick.substring(thirdQuotePos + QUOTE.length, fourthQuotePos);
        p = p.then(() => resourceService.saveSound(dictId, resourceName))
              .then(resourceInfo => {
                  $(this).attr("onclick", `return playInternalAudio("${resourceInfo.internalLink}", "${resourceInfo.mimeType.toString()}")`);
                  return Promise.resolve();
              });
      });
  await p;
  return $("body").html() as string;
}
