import { Map } from 'immutable';
import * as fs from 'fs';
import { Interface, createInterface } from 'readline';
import { Optional } from 'typescript-optional';
import { WordFormLine } from './domain/WordFormLine';

export class WordFormReader {
    private changedWordToOriginalWordMap: Map<string, string> = Map();

    private initiated = false;

    private readonly readlineInterface: Interface;

    constructor(absFilePath: string) {
        const fileStream = fs.createReadStream(absFilePath);
        this.readlineInterface = createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
    }

    public getOriginalWord(changedWord: string): Optional<string> {
        if (!this.initiated) {
            throw new Error('WordFormReader.init() has to be called first.');
        }
        if (!this.changedWordToOriginalWordMap.contains(changedWord)) {
            return Optional.empty();
        }
        return Optional.ofNullable(this.changedWordToOriginalWordMap.get(changedWord));
    }

    private async init(): Promise<void> {
        this.readlineInterface.on('line', line => {
            const wordFormLine = WordFormReader.parseLine(line);
            if (!wordFormLine.isPresent()) {
                return;
            }
            wordFormLine.get().changedWordList.forEach(changedWord => {
                this.changedWordToOriginalWordMap.set(changedWord, wordFormLine.get().originalWord);
            });
        });

        this.readlineInterface.on('close', () => {
            this.initiated = true;
            return Promise.resolve();
        });
    }

    private static parseLine(line: string): Optional<WordFormLine> {
        const words = line.split(/[,:]/).map(word => word.trim());
        if (words.length < 2) {
            return Optional.empty();
        }
        const wordFormLine: WordFormLine = new WordFormLine();
        [wordFormLine.originalWord] = words;
        for (let i = 1; i < words.length; i += 1) {
            wordFormLine.changedWordList.push(words[i]);
        }
        return Optional.of(wordFormLine);
    }
}
