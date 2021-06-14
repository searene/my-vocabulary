import { UrlUtils } from "../utils/UrlUtils";
import { MimeType } from './MimeType';

export class ResourceInfo {
  
  private readonly _mimeType: MimeType;
  
  constructor(private readonly _internalLink: string) {
    const ext = UrlUtils.getExtOrThrow(_internalLink);
    this._mimeType = MimeType.buildMimeTypeFromExt(ext);
  }
  
	get mimeType(): MimeType {
		return this._mimeType;
	}

  get internalLink(): string {
    return this._internalLink;
  }
  
}