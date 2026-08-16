const SOURCE_NAMES = {
  dictionary: "Unified Nuer Dictionary",
  indexedDictionary: "English–Nuer Indexed Dictionary",
  examples: "Curated Examples",
  vocabulary: "Ethio Language Box Vocabulary",
  structures: "Ethio Language Box Structures",
  conversation: "Ethio Language Box Conversation",
  grammar: "Ethio Language Box Grammar",
  storybook: "African Storybook Corpus",
  bible: "Nuer Bible",
};

const SEARCHABLE_FIELDS = ["english", "nuer", "topic_title", "book_english"];

let knowledgeBasePromise;

function normalise(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchText(record) {
  return SEARCHABLE_FIELDS.map((field) => record[field] || "").join(" ");
}

function toRecords(entries, source) {
  return entries.map((entry) => ({ ...entry, source }));
}

async function loadKnowledgeBase() {
  const [
    unifiedDictionary,
    indexedDictionary,
    examples,
    vocabulary,
    structures,
    conversation,
    grammar,
    storybook,
    bible,
    systemPrompt,
    grammarRules,
  ] = await Promise.all([
    import("./unified_dictionary.json"),
    import("./english_nuer_indexed.json"),
    import("./examples.json"),
    import("./elb_vocabulary.json"),
    import("./elb_structures.json"),
    import("./elb_conversation.json"),
    import("./elb_grammar.json"),
    import("./asb_corpus.json"),
    import("./bible_index.min.json"),
    import("./system_prompt.md?raw"),
    import("./THOK_NATH_GRAMMAR_RULES.md?raw"),
  ]);

  const records = [
    ...toRecords(unifiedDictionary.default.entries, "dictionary"),
    ...toRecords(Object.values(indexedDictionary.default.index).flat(), "indexedDictionary"),
    ...toRecords(examples.default.examples, "examples"),
    ...toRecords(vocabulary.default.entries, "vocabulary"),
    ...toRecords(structures.default.entries, "structures"),
    ...toRecords(conversation.default.entries, "conversation"),
    ...toRecords(grammar.default.entries, "grammar"),
    ...storybook.default.entries.map((entry) => ({
      ...entry,
      nuer: entry.nuer_sentence,
      english: entry.english_sentence,
      source: "storybook",
    })),
    ...toRecords(Object.values(bible.default.by_verse), "bible"),
  ];

  const fallbackMatch = systemPrompt.default.match(/say this exact phrase in Thok Nath:\s*\n\s*\*\*(.+?)\*\*/i);

  return {
    records,
    fallback: fallbackMatch?.[1] || "Kua̱cä mɛ ci̱ lar ɔ kä /ka̱n jɛ jek rɛy wargakni̱ tin caa ƴä ŋi̱eec kɛ kɛ.",
    guidanceLoaded: Boolean(systemPrompt.default.trim() && grammarRules.default.trim()),
  };
}

function getKnowledgeBase() {
  if (!knowledgeBasePromise) knowledgeBasePromise = loadKnowledgeBase();
  return knowledgeBasePromise;
}

function scoreRecord(record, query, tokens, grammarQuestion) {
  const haystack = normalise(searchText(record));
  if (!haystack) return 0;

  let score = 0;
  if (haystack === query) score += 100;
  if (haystack.includes(query)) score += 45;

  for (const token of tokens) {
    if (token.length > 1 && haystack.includes(token)) score += 8;
  }

  if (grammarQuestion && ["grammar", "structures"].includes(record.source)) score += 24;
  if (/bible|verse|scripture|genesis|psalm|john|matthew/.test(query) && record.source === "bible") score += 32;
  if (/meaning|define|definition|word|translate/.test(query) && ["dictionary", "indexedDictionary", "vocabulary"].includes(record.source)) score += 18;

  return score;
}

function formatRecord(record) {
  const lines = [];
  if (record.nuer) lines.push(`**Thok Nath:** ${record.nuer}`);
  if (record.english) lines.push(`**English:** ${record.english}`);
  if (record.topic_title) lines.push(`Topic: ${record.topic_title}`);
  if (record.book_english) lines.push(`Reference: ${record.book_english} ${record.chapter}:${record.verse}`);
  lines.push(`Source: ${SOURCE_NAMES[record.source]}`);
  return lines.join("  \n");
}

function findVerse(records, query) {
  const match = query.match(/\b([a-z]{2,})\s*(\d{1,3})\s*[:.]\s*(\d{1,3})\b/i);
  if (!match) return null;

  const [, book, chapter, verse] = match;
  return records.find((record) =>
    record.source === "bible" &&
    String(record.chapter) === chapter &&
    String(record.verse) === verse &&
    (normalise(record.book_english).startsWith(normalise(book)) || normalise(record.book_abbr) === normalise(book))
  );
}

/**
 * Dataset-grounded retrieval for the landing-page chat. It deliberately returns
 * attested source text instead of generating new Thok Nath sentences.
 */
export async function askNaathAi(input) {
  const question = input.trim();
  if (!question) return null;

  const { records, fallback, guidanceLoaded } = await getKnowledgeBase();
  const query = normalise(question);
  const verse = findVerse(records, question);

  if (verse) {
    return {
      text: `Here is the verified verse from the local Nuer Bible.\n\n${formatRecord(verse)}`,
      sources: [SOURCE_NAMES.bible],
      guidanceLoaded,
    };
  }

  const tokens = query.split(" ").filter((token) => token.length > 1);
  const grammarQuestion = /grammar|tense|pronoun|plural|negative|future|past|sentence structure/.test(query);
  const matches = records
    .map((record) => ({ record, score: scoreRecord(record, query, tokens, grammarQuestion) }))
    .filter(({ score }) => score >= 16)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!matches.length) {
    return {
      text: `${fallback}\n\nI could not find a verified match in the local datasets. Try a word, short phrase, grammar pattern, or Bible reference such as “Genesis 1:1”.`,
      sources: [],
      guidanceLoaded,
    };
  }

  return {
    text: `I found verified data in the local knowledge base.\n\n${matches.map(({ record }) => formatRecord(record)).join("\n\n---\n\n")}`,
    sources: [...new Set(matches.map(({ record }) => SOURCE_NAMES[record.source]))],
    guidanceLoaded,
  };
}

export const CHAT_STARTERS = [
  "What does Ri̱a̱ng mean?",
  "How do I say good morning?",
  "Show a future tense example",
  "Genesis 1:1",
];
