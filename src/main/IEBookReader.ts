export interface IEBookReader {

    init(): Promise<void>;

    readAll(): Promise<string>;

}