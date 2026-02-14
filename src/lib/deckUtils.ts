/**
 * Validates that a deck entry has both word and english filled.
 * Used by CreateDeck before adding a card.
 */
export function isValidDeckEntry(values: {
  word?: string | null;
  english?: string | null;
}): boolean {
  const word = values.word ?? "";
  const english = values.english ?? "";
  return word.trim() !== "" && english.trim() !== "";
}
