const WHITE_ORDER = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_AFTER: Record<string, string> = {
  C: "C#",
  D: "D#",
  F: "F#",
  G: "G#",
  A: "A#",
};

export function generateRange(startOct = 2, endOct = 5) {
  const whites: { note: string; black?: string }[] = [];
  for (let oct = startOct; oct <= endOct; oct++) {
    for (const w of WHITE_ORDER) {
      const whiteNote = `${w}${oct}`;
      const blackName = BLACK_AFTER[w];

      // do not create black key for octave end if black would be in next octave beyond C5
      // Specifically, if we are at C5, we don't want C#5
      const isLastNote = whiteNote === `C${endOct}`;
      const blackNote =
        blackName && !isLastNote ? `${blackName}${oct}` : undefined;

      whites.push({ note: whiteNote, black: blackNote });

      // Stop generating after C5
      if (isLastNote) break;
    }
  }
  return whites;
}
