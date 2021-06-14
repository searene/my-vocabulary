import * as path from "path";
import * as fs from "fs-extra";
import { Configs } from "../config/Configs";
import { FileUtils } from "../utils/FileUtils";
import { UrlUtils } from "../utils/UrlUtils";
import { ResourceInfo } from "./ImageInfo";
import { injectable } from "@parisholley/inversify-async";
import { MimeType } from "./MimeType";
import { container } from "../config/inversify.config";
import { DictService } from "../dict/DictService";
import { types } from "../config/types";
import { SoundHTMLTransformer } from "./transformer/SoundHTMLTransformer";

@injectable()
export class ResourceService {
  /**
   * Save the image and return the image internal link.
   */
  async saveImage(imageSrc: string): Promise<ResourceInfo> {
    if (!imageSrc.startsWith("http") && !imageSrc.startsWith("https")) {
      throw new Error("Invalid image src: " + imageSrc);
    }
    const ext = await this.getImageExt(imageSrc);
    const imgFilePath = FileUtils.getNewInternalFilePath(ext);
    await FileUtils.download(imageSrc, imgFilePath);
    return new ResourceInfo(await UrlUtils.getInternalResourceLink(imgFilePath));
  }

  async saveSound(dictId: number, resourceName: string): Promise<ResourceInfo> {
    const ext = FileUtils.getExt(resourceName);
    const filePath = FileUtils.getNewInternalFilePath(ext);
    const dictService = await container.getAsync<DictService>(types.DictService);
    const audioBuffer = await dictService.getDictSpecificResource(dictId, resourceName);
    await FileUtils.saveBufferToFile(audioBuffer, filePath);
    return new ResourceInfo(await UrlUtils.getInternalResourceLink(filePath));
  }

  getInternalResourceAsBuffer = async (internalLink: string): Promise<Buffer> => {
    return await fs.readFile(this.getLocalFilePathFromInternalLink(internalLink));
  };

  getLocalFilePathFromInternalLink(internalLink: string): string {
    const url = new URL(internalLink);
    const fileName = url.hostname;
    return path.join(Configs.get().getResourceDir(), fileName);
  }

  async getImageExt(imageSrc: string): Promise<string> {
    return (await MimeType.buildImageMimeTypeFromUrl(imageSrc)).getExt();
  }

  async transformDictHTML(html: string): Promise<string> {
    const htmlTransformers = [new SoundHTMLTransformer()];
    let result = html;
    for (const htmlTransformer of htmlTransformers) {
      result = await htmlTransformer.transformHTML(result);
    }
    return result;
  }
}
