// Curated Nuer (Thok Naath) ↔ English parallel corpus.
// Replace with calls to your dataset / translation model backend.

export const corpus = {
  en_to_nuer: [
    { en: "How are you?", nuer: "Maku?" },
    { en: "I am fine.", nuer: "Ɛ kɛ nhiɛr." },
    { en: "What is your name?", nuer: "Naŋa wɛ̱kä?" },
    { en: "My name is John.", nuer: "Naŋa gä Johan." },
    { en: "Good morning.", nuer: "Cäŋ nhial." },
    { en: "Good evening.", nuer: "Cäŋ de." },
    { en: "The cattle are grazing.", nuer: "Ciek ke cak." },
    { en: "Where are you going?", nuer: "Naŋa dɔ ɛ́?" },
    { en: "I am going home.", nuer: "Ɛ dɔ ŋäcä." },
    { en: "Thank you.", nuer: "Naŋa lɔ." },
    { en: "Water is life.", nuer: "Pïr ɛ kuɔŋ." },
    { en: "The child is sleeping.", nuer: "Nhïïm de kuaŋ." },
    { en: "Open the door.", nuer: "Yic guöp." },
    { en: "I love you.", nuer: "Ɛ rïthä kua." },
    { en: "Come here.", nuer: "Wälä ŋä." },
    { en: "See you tomorrow.", nuer: "Rïïl ŋuan." },
  ],
  nuer_to_en: [
    { nuer: "Maku?", en: "How are you?" },
    { nuer: "Cäŋ nhial.", en: "Good morning." },
    { nuer: "Naŋa wɛ̱kä?", en: "What is your name?" },
    { nuer: "Pïr ɛ kuɔŋ.", en: "Water is life." },
    { nuer: "Naŋa lɔ.", en: "Thank you." },
    { nuer: "Ɛ dɔ ŋäcä.", en: "I am going home." },
    { nuer: "Ciek ke cak.", en: "The cattle are grazing." },
    { nuer: "Rïïl ŋuan.", en: "See you tomorrow." },
  ],
};

export const dictionary = {
  "hello": "Cäŋ nhial",
  "hi": "Cäŋ",
  "good morning": "Cäŋ nhial",
  "good evening": "Cäŋ de",
  "good night": "Cäŋ kuɔŋ",
  "thank you": "Naŋa lɔ",
  "thanks": "Naŋa lɔ",
  "water": "Pïr",
  "life": "kuɔŋ",
  "child": "nhïïm",
  "children": "kä",
  "cattle": "ciek",
  "cow": "cak",
  "home": "ŋäcä",
  "house": "guöp",
  "door": "guöp",
  "name": "naŋa",
  "go": "dɔ",
  "going": "dɔ",
  "come": "wälä",
  "eat": "cɛm",
  "food": "cɛm",
  "sleep": "kuaŋ",
  "sleeping": "kuaŋ",
  "love": "rïthä",
  "see you": "rïïl",
  "tomorrow": "ŋuan",
  "i": "Ɛ",
  "am": "kɛ",
  "is": "ɛ",
  "are": "kɛ",
  "the": "",
  "a": "",
  "you": "kua",
  "your": "kua",
  "my": "gä",
  "how": "maku",
  "what": "wɛ̱kä",
  "where": "kä",
  "fine": "nhiɛr",
  "open": "yic",
};

export const reverseDictionary = Object.fromEntries(
  Object.entries(dictionary)
    .filter(([, v]) => v)
    .map(([k, v]) => [v.toLowerCase().replace(/[.,!?]/g, ""), k])
);

export const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "nuer", name: "Nuer (Thok Naath)" },
  { code: "dinka", name: "Dinka" },
  { code: "shilluk", name: "Shilluk" },
  { code: "bari", name: "Bari" },
];

export const datasets = [
  { name: "Nuer Parallel Corpus v1", pairs: "1,240,000+", domain: "General + Cultural", license: "CC-BY 4.0" },
  { name: "Dinka Speech Dataset", pairs: "380h", domain: "Read + Conversational", license: "CC-BY 4.0" },
  { name: "Shilluk Text Corpus", pairs: "210,000+", domain: "News + Oral", license: "CC-BY 4.0" },
  { name: "Nilotic Linguistic Atlas", pairs: "98,000+", domain: "Dictionaries", license: "CC-BY-SA 4.0" },
];
