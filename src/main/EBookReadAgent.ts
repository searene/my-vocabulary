import { IEBookReader } from './IEBookReader';
import { Map } from 'immutable';
import { Optional } from 'typescript-optional';
import { extname } from 'path';

export class EBookReadAgent {
    static readers: Map<string, IEBookReader> = Map();
    static register(ext: string, reader: IEBookReader) {
        EBookReadAgent.readers.set(ext, reader);
    }
    static async readAll(filePath: string): Promise<Optional<string>> {

        const ext = extname(filePath);
        const reader = EBookReadAgent.readers.get(ext);
        if (reader === undefined) {
            return Optional.empty();
        }
        const contents = await reader.readAll();
        return Optional.of(contents);
    }
}