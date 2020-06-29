export interface IEBookReader {

    new (filePath: string): IEBookReader;

    readAll: () => Promise<string>;

}