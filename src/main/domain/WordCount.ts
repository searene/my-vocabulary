export type WordCount = {
  unknown: number;
  known: number;
  skipped: number;
};

export const ALL_ZEROS_WORD_COUNT: WordCount = {
  unknown: 0,
  known: 0,
  skipped: 0,
};