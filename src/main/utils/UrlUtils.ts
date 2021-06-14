import * as path from 'path';

export class UrlUtils {
  static getInternalResourceLink = async (
    resourceFilePath: string
  ): Promise<string> => {
    return `${UrlUtils.getInternalResourceLinkProtocol()}://${path.basename(resourceFilePath)}`;
  };

  static getInternalResourceLinkProtocol = (): string => {
    return "mc";
  };

  static getExt(url: string): string | undefined {
    const urlSplit = url.split(".");
    if (urlSplit.length <= 1) {
      return undefined;
    } else {
      return urlSplit[urlSplit.length - 1];
    }
  }

  static getExtOrThrow(url: string): string {
    const ext = this.getExt(url);
    if (ext === undefined) {
      throw new Error("Extension is not available from url: " + url);
    }
    return ext;
  }
}
