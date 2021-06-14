export interface HTMLTransformer {
    transformHTML(html: string): Promise<string>;
}