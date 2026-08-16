import { corpus, dictionary, reverseDictionary } from "./translations";

/**
 * translate(text, direction)
 *  - direction: "en->nuer" | "nuer->en"
 *
 * Dataset-backed deterministic translator. Swap the body for a call to your
 * hosted NLLB / custom model — the public signature stays the same.
 *
 * Returns: { output, source, confidence }
 */
export function translate(input, direction = "en->nuer") {
  const text = (input || "").trim();
  if (!text) return { output: "", source: "empty", confidence: 0 };

  const isEnToNuer = direction === "en->nuer";
  const pool = isEnToNuer ? corpus.en_to_nuer : corpus.nuer_to_en;
  const srcKey = isEnToNuer ? "en" : "nuer";
  const tgtKey = isEnToNuer ? "nuer" : "en";

  const normalised = text.toLowerCase().replace(/[.!?]+$/, "").trim();

  // 1) exact match in the parallel corpus
  const exact = pool.find(
    (row) => row[srcKey].toLowerCase().replace(/[.!?]+$/, "").trim() === normalised
  );
  if (exact) {
    return { output: exact[tgtKey], source: "corpus:exact", confidence: 0.98 };
  }

  // 2) contains-match
  const contains = pool.find((row) => row[srcKey].toLowerCase().includes(normalised));
  if (contains) {
    return { output: contains[tgtKey], source: "corpus:partial", confidence: 0.86 };
  }

  // 3) word-by-word dictionary fallback
  const dict = isEnToNuer ? dictionary : reverseDictionary;
  const tokens = normalised.split(/\s+/);
  const translatedTokens = tokens.map((t) => {
    const cleaned = t.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]/g, "").toLowerCase();
    if (dict[cleaned]) return dict[cleaned];
    if (dict[cleaned.replace(/[.,!?]/g, "")]) return dict[cleaned.replace(/[.,!?]/g, "")];
    return t;
  });

  const output = translatedTokens.join(" ").replace(/\s+/g, " ").trim();
  const coverage =
    translatedTokens.filter((t) => dict[t.toLowerCase()]).length / tokens.length;

  return {
    output: output || "—",
    source: coverage > 0 ? "dictionary" : "unknown",
    confidence: Math.min(0.75, 0.3 + coverage * 0.5),
  };
}
