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
      const blackNote = blackName ? `${blackName}${oct}` : undefined;
      whites.push({ note: whiteNote, black: blackNote });
    }
  }
  // Trim to C2..C5 inclusive: keep until C5 and stop
  const endIndex = whites.findIndex((w) => w.note === "C5");
  if (endIndex >= 0) return whites.slice(0, endIndex + 1);
  return whites;
}
