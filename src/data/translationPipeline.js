const SOURCE_LABELS = {
  vocabulary: "Ethio Language Box Vocabulary",
  dictionary: "Unified Nuer Dictionary",
  indexedDictionary: "English–Nuer Dictionary",
  structures: "Ethio Language Box Structures",
  conversation: "Ethio Language Box Conversation",
  grammar: "Ethio Language Box Grammar",
  examples: "Curated Examples",
  storybook: "African Storybook Corpus",
};

const SOURCE_PRIORITY = [
  "vocabulary",
  "dictionary",
  "indexedDictionary",
  "conversation",
  "structures",
  "grammar",
  "examples",
  "storybook",
];

let translationDataPromise;

function normalise(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseEnglish(value = "") {
  return normalise(value)
    .replace(/\b(noun|verb|adjective|adverb|pronoun|preposition|conjunction|interjection|adj|adv|n|v)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function withSource(entries, source) {
  return entries.map((entry) => ({ ...entry, source }));
}

async function loadTranslationData() {
  const [dictionary, indexedDictionary, examples, vocabulary, structures, conversation, grammar, storybook] = await Promise.all([
    import("./dataset/unified_dictionary.json"),
    import("./dataset/english_nuer_indexed.json"),
    import("./dataset/examples.json"),
    import("./dataset/elb_vocabulary.json"),
    import("./dataset/elb_structures.json"),
    import("./dataset/elb_conversation.json"),
    import("./dataset/elb_grammar.json"),
    import("./dataset/asb_corpus.json"),
  ]);

  const records = [
    ...withSource(vocabulary.default.entries, "vocabulary"),
    ...withSource(dictionary.default.entries, "dictionary"),
    ...withSource(Object.values(indexedDictionary.default.index).flat(), "indexedDictionary"),
    ...withSource(conversation.default.entries, "conversation"),
    ...withSource(structures.default.entries, "structures"),
    ...withSource(grammar.default.entries, "grammar"),
    ...withSource(examples.default.examples, "examples"),
    ...storybook.default.entries.map((entry) => ({
      english: entry.english_sentence,
      nuer: entry.nuer_sentence,
      source: "storybook",
    })),
  ];

  return records.sort((left, right) => SOURCE_PRIORITY.indexOf(left.source) - SOURCE_PRIORITY.indexOf(right.source));
}

function getTranslationData() {
  if (!translationDataPromise) translationDataPromise = loadTranslationData();
  return translationDataPromise;
}

function exactMatch(records, input, direction) {
  const query = direction === "en->nuer" ? normaliseEnglish(input) : normalise(input);
  const sourceField = direction === "en->nuer" ? "english" : "nuer";
  const normaliser = direction === "en->nuer" ? normaliseEnglish : normalise;

  return records.find((record) => normaliser(record[sourceField]) === query);
}

function translateWordByWord(records, input, direction) {
  const sourceField = direction === "en->nuer" ? "english" : "nuer";
  const targetField = direction === "en->nuer" ? "nuer" : "english";
  const normaliser = direction === "en->nuer" ? normaliseEnglish : normalise;
  const words = input.match(/[\p{L}\p{N}]+|[^\p{L}\p{N}\s]+/gu) || [];
  let matched = 0;

  const translated = words.map((word) => {
    if (!/[\p{L}\p{N}]/u.test(word)) return word;
    const match = records.find((record) => normaliser(record[sourceField]) === normaliser(word));
    if (!match) return word;
    matched += 1;
    return match[targetField];
  });

  const wordCount = words.filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
  return { output: translated.join(" ").replace(/\s+([,.!?;:])/g, "$1"), matched, wordCount };
}

/**
 * Local NLP translation pipeline. It only returns attested translations from
 * src/data: exact phrases first, then exact word-level dictionary matches.
 */
export async function translateNuer(input, direction = "en->nuer") {
  const text = input.trim();
  if (!text) return { output: "", source: "", confidence: 0 };

  const records = await getTranslationData();
  const targetField = direction === "en->nuer" ? "nuer" : "english";
  const direct = exactMatch(records, text, direction);

  if (direct) {
    return {
      output: direct[targetField],
      source: SOURCE_LABELS[direct.source],
      confidence: 1,
    };
  }

  const wordByWord = translateWordByWord(records, text, direction);
  if (wordByWord.wordCount && wordByWord.matched === wordByWord.wordCount) {
    return {
      output: wordByWord.output,
      source: "Verified dictionary entries",
      confidence: 0.82,
    };
  }

  return {
    output: "No verified translation was found for this complete input.",
    source: "Local dataset coverage",
    confidence: 0,
  };
}
