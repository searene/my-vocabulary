import { FileUtils } from "../utils/FileUtils";
import { UrlUtils } from "../utils/UrlUtils";
import { MimeType } from './MimeType';

export class ImageInfo {
  
  private readonly _mimeType: MimeType;
  
  constructor(private readonly _internalLink: string) {
    const ext = UrlUtils.getExtOrThrow(_internalLink);
    this._mimeType = MimeType.buildImageMimeTypeFromExt(ext);
  }
  
	get mimeType(): MimeType {
		return this._mimeType;
	}

  get internalLink(): string {
    return this._internalLink;
  }
  
}