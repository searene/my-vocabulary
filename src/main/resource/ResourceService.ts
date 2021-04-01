import * as path from "path";
import * as fs from "fs-extra";
import { Configs } from "../config/Configs";
import { FileUtils } from "../utils/FileUtils";
import { UrlUtils } from "../utils/UrlUtils";
import { ImageInfo } from "./ImageInfo";
import { injectable } from "@parisholley/inversify-async";
import { MimeType } from "./MimeType";

@injectable()
export class ResourceService {
  /**
   * Save the image and return the image internal link.
   */
  async saveImage(imageSrc: string): Promise<ImageInfo> {
    console.log("a")
    if (!imageSrc.startsWith("http") || !imageSrc.startsWith("https")) {
      throw new Error("Invalid image src: " + imageSrc);
    }
    console.log("b")
    const ext = await this.getImageExt(imageSrc);
    console.log("c")
    const imgFilePath =
      path.join(Configs.get().getResourceDir(), Date.now().toString()) +
      "." +
      ext;
    console.log("d")
    await FileUtils.download(imageSrc, imgFilePath);
    console.log("e")
    return new ImageInfo(await UrlUtils.getInternalImageLink(imgFilePath));
  }

  getImageAsBuffer = async (internalImageLink: string): Promise<Buffer> => {
    return await fs.readFile(this.getLocalFilePathFromInternalLink(internalImageLink));
  };

  getLocalFilePathFromInternalLink(internalLink: string): string {
    const url = new URL(internalLink);
    const fileName = url.hostname;
    return path.join(Configs.get().getResourceDir(), fileName);
  }

  async getImageExt(imageSrc: string): Promise<string> {
    return (await MimeType.buildImageMimeTypeFromUrl(imageSrc)).getExt();
  }
}
