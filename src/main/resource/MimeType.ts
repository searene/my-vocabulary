import fetch from "electron-fetch";

export class MimeType {

  private constructor(
    private readonly _type: string,
    private readonly _subtype: string
  ) {}

  private static knownTypeList = [{
    subType: "jpeg",
    ext: "jpg",
  }, {
    subType: "svg+xml",
    ext: "svg",
  }, {
    subType: "gif",
    ext: "gif",
  }, {
    subType: "png",
    ext: "png",
  }, {
    subType: "webp",
    ext: "webp",
  }];

  getExt(): string {
    for (const knownType of MimeType.knownTypeList) {
      if (knownType.subType === this._subtype) {
        return knownType.ext;
      }
    }
    throw new Error("Ext is unavailable for mimeType: " + this.toString());
  }
  
  static buildImageMimeTypeFromExt(ext: string): MimeType {
    ext = ext.toLowerCase();
    for (const knownType of this.knownTypeList) {
      if (knownType.ext === ext) {
        return new MimeType("image", knownType.subType);
      }
    }
    throw new Error(`Unsupported extension: ${ext}`);
  }
  
  static async buildImageMimeTypeFromUrl(url: string): Promise<MimeType> {
    let blobType = null;
    try {
      blobType = (await (await fetch(url)).blob()).type;
    } catch (e) {
      console.log("Got an error");
      console.error(e)
    }
    if (blobType?.indexOf(";") !== -1) {
      // blobType may be "image/jpeg; charset=utf-8"
      blobType = blobType?.substring(0, blobType?.indexOf(";"))
    }
    const blobTypeSplit = blobType!.split("/");
    if (blobTypeSplit.length !== 2) {
      throw new Error("blobTypeSplit.length should be 2, actual blobType: " + blobType);
    }
    return new MimeType(blobTypeSplit[0], blobTypeSplit[1]);
  }

  static buildImageTypeFromInternalResourceLink(internalLink: string): MimeType {
    const internalLinkSplit = internalLink.split(".");
    if (internalLinkSplit.length < 2) {
      throw new Error("The length of internalLink split is less than 2, actual internalLink: " + internalLink);
    }
    const ext = internalLinkSplit[1];
    return this.buildImageMimeTypeFromExt(ext);
  }
  
  toString() {
    return `${this._type}/${this._subtype}`;
  }
}